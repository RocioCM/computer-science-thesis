import { StatusCodes } from 'http-status-codes';
import { ethers } from 'ethers';
import { IResult } from 'src/pkg/interfaces/result';
import { getEnv } from 'src/pkg/helpers/env';
import logger from 'src/pkg/helpers/logger';

type ABIInput = {
  internalType: string;
  name: string;
  type: string;
  indexed?: boolean;
  components?: ABIInput[];
};

type ABIOutput = {
  internalType: string;
  name: string;
  type: string;
  components?: ABIInput[];
};

export type ABIEntry = {
  type: 'event' | 'function' | 'constructor' | 'fallback';
  name?: string;
  inputs?: ABIInput[];
  outputs?: ABIOutput[];
  anonymous?: boolean;
  stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
};

export type ABI = ABIEntry[];

export type EventEntry = {
  name: string;
  args: any[];
};

function getMethodAbi(abi: ABI, methodName: string): ABIEntry | null {
  const methodAbi = abi.find(
    (abiEntry) => abiEntry.type === 'function' && abiEntry.name === methodName,
  );
  return methodAbi || null;
}

function getEventAbi(abi: ABI, eventName: string): ABIEntry | null {
  const eventAbi = abi.find(
    (abiEntry) => abiEntry.type === 'event' && abiEntry.name === eventName,
  );
  return eventAbi || null;
}

function formatField(
  field: ABIInput | ABIOutput,
  value: any,
): number | string | Object | any[] {
  if (field.type === 'uint256' || typeof value === 'bigint') {
    return Number(value);
  }
  if (field.type.endsWith('[]')) {
    return value.map((v: any) =>
      formatField(
        {
          name: '',
          internalType: '',
          type: field.type.slice(0, -2),
          components: field.components,
        },
        v,
      ),
    );
  }
  if (field.type === 'tuple') {
    return value.reduce((acc: any, v: any, index: number) => {
      if (!field.components) return acc;
      acc[field.components[index].name] = formatField(
        field.components[index],
        v,
      );
      return acc;
    }, {});
  }

  return value;
}

async function formatResponse<T = Object>(
  abi: ABI,
  methodName: string,
  response: ethers.Result,
): IResult<T> {
  const methodAbi = getMethodAbi(abi, methodName);
  if (!methodAbi)
    return {
      ok: false,
      status: StatusCodes.NOT_FOUND,
      data: null,
    };

  const outputsAbi = methodAbi.outputs;

  // No outputs defined in ABI, return response as is:
  if (!outputsAbi?.length)
    return {
      ok: true,
      status: StatusCodes.OK,
      data: null as T,
    };

  // Returned value is a single value:
  if (outputsAbi[0].name === '') {
    return {
      ok: true,
      status: StatusCodes.OK,
      data: formatField(outputsAbi[0], response) as T,
    };
  }

  // Returned value is a tuple or struct:
  // Format response according to ABI. Future improvement: this formatter only works for simple types,
  // in case you have complex types like structs, you should implement a recursive function to format the response.
  const formattedResponse = outputsAbi.reduce<Record<string, any>>(
    (acc, output, index) => {
      acc[output.name] = formatField(output, response[index]);
      return acc;
    },
    {},
  );

  return { ok: true, status: StatusCodes.OK, data: formattedResponse as T };
}

async function parseReceiptEvents(
  abi: ABI,
  contract: ethers.Contract,
  receipt: ethers.ContractTransactionReceipt,
): IResult<EventEntry[]> {
  // In ethers v6, receipt.events is not available. Instead, parse the logs manually.
  const events: ethers.LogDescription[] = receipt.logs
    .map((log) => {
      try {
        return contract.interface.parseLog(log); // Attempt to parse each log with the contract interface
      } catch (error) {
        return null; // If the log does not belong to this contract, skip it
      }
    })
    .filter((event) => event !== null);

  if (!events.length) {
    return { ok: true, status: StatusCodes.OK, data: [] };
  }

  const formattedEvents = [];

  for (const event of events) {
    // Only add event to formattedEvents if it has a corresponding ABI entry in the contract ABI.
    // Elsecase, it's an event from another contract.
    const eventAbi = getEventAbi(abi, event.name);
    if (eventAbi && eventAbi.inputs?.length) {
      const args: ethers.Result = event.args;
      const formattedArgs = args.map((arg: any, index: number) => {
        const abiInput = eventAbi.inputs?.[index];
        return abiInput ? formatField(abiInput, arg) : arg;
      });

      const formattedEvent: EventEntry = {
        name: event.name,
        args: formattedArgs,
      };

      formattedEvents.push(formattedEvent);
    }
  }

  return { ok: true, status: StatusCodes.OK, data: formattedEvents };
}

let wallet: ethers.Wallet | null = null; // Instantiate wallet only once globally

function getWallet(): ethers.Wallet {
  if (wallet) return wallet;
  const provider = new ethers.JsonRpcProvider(getEnv('PROVIDER_URL'));
  wallet = new ethers.Wallet(getEnv('PRIVATE_KEY'), provider);
  return wallet;
}

async function callContractMethod(
  contractAddress: string,
  abi: ABI,
  methodName: string,
  ...args: any[]
): IResult<EventEntry[]> {
  try {
    const wallet = getWallet();
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const provider = wallet.provider!;
    const nonce = await provider.getTransactionCount(wallet.address);

    const txOptions: Partial<ethers.ContractTransaction> = { nonce };

    const method = contract.getFunction(methodName);
    const tx: ethers.ContractTransactionResponse = await method(
      ...args,
      txOptions,
    );
    const receipt = await tx.wait();
    if (receipt === null)
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };

    return parseReceiptEvents(abi, contract, receipt);
  } catch (err: any) {
    logger.error('BLOCKCHAIN TRANSACTION ERROR: ', err);
    const errorMessage =
      err?.shortMessage || err?.message || 'Internal server error';
    return {
      ok: false,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: errorMessage,
    };
  }
}

async function callPureContractMethod<T = any>(
  contractAddress: string,
  abi: ABI,
  methodName: string,
  ...args: any[]
): IResult<T> {
  try {
    const wallet = getWallet();
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const method = contract.getFunction(methodName);
    const res: ethers.Result = await method(...args);
    console.log('callPureContractMethod', methodName, res);
    return formatResponse<T>(abi, methodName, res);
  } catch (err: any) {
    logger.error('BLOCKCHAIN TRANSACTION ERROR: ', err);
    const errorMessage =
      err?.shortMessage || err?.message || 'Internal server error';
    return {
      ok: false,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: errorMessage,
    };
  }
}

const blockchainHelper = {
  callContractMethod,
  callPureContractMethod,
};

export default blockchainHelper;
