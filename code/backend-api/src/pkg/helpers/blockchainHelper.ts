import { StatusCodes } from 'http-status-codes';
import { ethers, Result } from 'ethers';
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

function getMethodAbi(abi: ABI, methodName: string): ABIEntry | null {
  const methodAbi = abi.find(
    (abiEntry) => abiEntry.type === 'function' && abiEntry.name === methodName,
  );
  return methodAbi || null;
}

function formatField(field: ABIOutput, value: any) {
  if (field.type === 'uint256' || typeof value === 'bigint') {
    return Number(value);
  }
  if (field.type.endsWith('[]')) {
    return value.map((v: any) =>
      formatField(
        { name: '', internalType: '', type: field.type.slice(0, -2) },
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
  response: Result,
): IResult<T> {
  const methodAbi = getMethodAbi(abi, methodName);
  if (!methodAbi)
    return {
      ok: false,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: null,
    };

  const outputsAbi = methodAbi.outputs;

  // No outputs defined in ABI, return response as is:
  if (!outputsAbi?.length)
    return {
      ok: false,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data: null,
    };

  // Returned value is a single value:
  if (outputsAbi[0].name === '') {
    return formatField(outputsAbi[0], response);
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

async function callContractMethod<T = any>(
  contractAddress: string,
  abi: ABI,
  methodName: string,
  ...args: any[]
): IResult<T> {
  try {
    const provider = new ethers.JsonRpcProvider(getEnv('PROVIDER_URL'));
    const wallet = new ethers.Wallet(getEnv('PRIVATE_KEY'), provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const method = contract.getFunction(methodName);
    const res: Result = await method(...args);
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
};

export default blockchainHelper;
