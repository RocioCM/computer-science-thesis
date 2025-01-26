import hre, { ethers } from 'hardhat';
import logger from '../utils/logger';
import { getEnv } from '../utils/env';

const CONTRACT_NAME = 'ConsentManager';

async function main() {
  const [deployer] = await ethers.getSigners();
  logger.info('Deploying contracts with the account:', deployer.address);

  const Contract = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = await Contract.deploy();
  const contractAddress = await contract.getAddress();
  logger.info('Contract address:', contractAddress);

  const network = getEnv('HARDHAT_NETWORK', 'localhost');
  const isRealNetwork = !!network && network !== 'localhost';

  if (isRealNetwork) {
    logger.info('Verifying contract...');

    // Wait for network confirmation
    const res = await contract.waitForDeployment();
    await res.deploymentTransaction()?.wait(5);
    logger.success('Contract deployed on network:', network);

    try {
      await hre.run('verify:verify', {
        address: contractAddress,
        constructorArguments: [],
      });
      logger.success('Contract verified!');
    } catch (error: any) {
      if (error?.message?.toLowerCase().includes('already verified')) {
        logger.info('Contract already verified!');
      } else {
        logger.error('Verification failed:', error);
      }
    }
  }
  logger.success('Successful deployment!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
