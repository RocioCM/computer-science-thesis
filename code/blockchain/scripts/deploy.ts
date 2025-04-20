import hre, { ethers } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import logger from '../utils/logger';
import { getEnv } from '../utils/env';
import {
  BASE_BATCH_CONTRACT_NAME,
  PRODUCT_CONTRACT_NAME,
  RECYCLE_CONTRACT_NAME,
} from '../test/constants';

type Contract = Awaited<
  ReturnType<HardhatRuntimeEnvironment['ethers']['deployContract']>
>;

const getNetwork = () => getEnv('HARDHAT_NETWORK', 'localhost');

async function deployContract(
  contractName: string,
  constructorArguments: string[] = [],
): Promise<Contract> {
  const ContractFactory = await ethers.getContractFactory(contractName);
  const contract = await ContractFactory.deploy(...constructorArguments);
  const contractAddress = await contract.getAddress();

  // Wait for network confirmation
  const network = getNetwork();
  const isRealNetwork = !!network && network !== 'localhost';
  if (isRealNetwork) {
    const res = await contract.waitForDeployment();
    await res.deploymentTransaction()?.wait(5);
  }
  logger.success(
    `Contract ${contractName} deployed on network ${network} at address ${contractAddress}`,
  );

  return contract as Contract;
}

async function verifyContract(
  contractName: string,
  contract: Contract,
  constructorArguments: string[] = [],
) {
  try {
    const contractAddress = await contract.getAddress();
    await hre.run('verify:verify', {
      address: contractAddress,
      constructorArguments,
    });
    logger.success('Contract', contractName, 'verified!');
  } catch (error: any) {
    if (error?.message?.toLowerCase().includes('already verified')) {
      logger.info('Contract', contractName, 'already verified!');
    } else {
      logger.error('Contract', contractName, 'verification failed:', error);
    }
  }
}

async function main() {
  const [deployer] = await ethers.getSigners();
  logger.info('Deploying contracts with the account:', deployer.address);

  const network = getNetwork();
  const isRealNetwork = !!network && network !== 'localhost';

  // Deploy contracts
  const recycledBottlesContract = await deployContract(RECYCLE_CONTRACT_NAME);
  const recycledAddress = await recycledBottlesContract.getAddress();

  const productBottlesContract = await deployContract(PRODUCT_CONTRACT_NAME, [
    recycledAddress,
  ]);
  const productAddress = await productBottlesContract.getAddress();

  const baseBottlesContract = await deployContract(BASE_BATCH_CONTRACT_NAME, [
    productAddress,
    recycledAddress,
  ]);
  const baseBatchAddress = await baseBottlesContract.getAddress();

  try {
    await productBottlesContract.setBaseBottlesBatchContract(baseBatchAddress);
    await recycledBottlesContract.setBaseBottlesBatchContract(baseBatchAddress);
    await recycledBottlesContract.setProductBottlesBatchContract(
      productAddress,
    );
  } catch (err) {
    logger.error('Failed to set up contracts addresses:', err); // Non-critical error
  }

  // Verify contracts
  if (isRealNetwork) {
    logger.info('Verifying contracts...');

    await verifyContract(RECYCLE_CONTRACT_NAME, recycledBottlesContract);
    await verifyContract(PRODUCT_CONTRACT_NAME, productBottlesContract, [
      recycledAddress,
    ]);
    await verifyContract(BASE_BATCH_CONTRACT_NAME, baseBottlesContract, [
      productAddress,
      recycledAddress,
    ]);
  }

  logger.info("Contract's addresses:");
  logger.info(`BASE_BATCH_CONTRACT_ADDRESS="${baseBatchAddress}"`);
  logger.info(`PRODUCT_BATCH_CONTRACT_ADDRESS="${productAddress}"`);
  logger.info(`RECYCLING_CONTRACT_ADDRESS="${recycledAddress}"`);
  logger.success('Successful deployment!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
