import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { getEnv } from './utils/env';
import 'solidity-coverage';
import '@typechain/hardhat';
import dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v6',
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },

    // TESTNET
    optimismSepolia: {
      url: `https://sepolia.optimism.io`, // RPC url
      chainId: 11155420,
      accounts: [`0x${getEnv('PRIVATE_KEY')}`],
    },

    // MAINNET
    optimisticEthereum: {
      url: `https://optimism-mainnet.infura.io`, // RPC url
      chainId: 10,
      accounts: [`0x${getEnv('PRIVATE_KEY')}`],
    },
  },
  etherscan: {
    apiKey: {
      optimismSepolia: getEnv('ETHERSCAN_API_KEY'),
    },
    customChains: [
      {
        network: 'optimismSepolia',
        chainId: 11155420,
        urls: {
          apiURL: 'https://api-sepolia-optimistic.etherscan.io/api',
          browserURL: 'https://sepolia-optimistic.etherscan.io',
        },
      },
    ],
  },
};

export default config;
