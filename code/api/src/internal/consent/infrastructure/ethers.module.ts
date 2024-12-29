import { Injectable, Inject } from '@nestjs/common';
import { ethers } from 'ethers';
import blockchainConfig from './config/blockchain.config';

export type ABIInput = {
  internalType: string;
  name: string;
  type: string;
  indexed?: boolean;
  components?: ABIInput[];
};

export type ABIOutput = {
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

@Injectable()
export class EthersProvider {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(
    @Inject(blockchainConfig.KEY) private config: Record<string, string>,
  ) {
    this.provider = new ethers.JsonRpcProvider(this.config.providerUrl);
    this.wallet = new ethers.Wallet(this.config.privateKey, this.provider);
  }

  getProvider() {
    return this.provider;
  }

  getWallet() {
    return this.wallet;
  }

  getContract(abi: ABI, address: string) {
    return new ethers.Contract(address, abi, this.wallet);
  }
}
