import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ethers, Result } from 'ethers';
import {
  ABI,
  ABIEntry,
  ABIOutput,
  EthersProvider,
} from '../infrastructure/ethers.module';
import { CONTRACT_ABI } from 'src/pkg/shared/constants';

type Consent = {
  id: number;
  active: boolean;
  creatorId: number;
  integrityHash: string;
};

type ConsentUser = {
  userId: number;
  status: number;
  activities: UserActivities;
};

type UserActivities = string[];

@Injectable()
export class ContractRepository {
  private contract: ethers.Contract;
  private abi: ABI;

  constructor(private readonly ethersProvider: EthersProvider) {
    this.abi = CONTRACT_ABI as ABI;
    const contractAddress = process.env.CONTRACT_ADDRESS;
    this.contract = this.ethersProvider.getContract(this.abi, contractAddress);
  }

  private getMethodAbi(methodName: string): ABIEntry | null {
    const methodAbi = this.abi.find(
      /// Replace by this.abi
      (abi) => abi.type === 'function' && abi.name === methodName,
    );
    return methodAbi || null;
  }

  private formatField(field: ABIOutput, value: any) {
    if (field.type === 'uint256' || typeof value === 'bigint') {
      return Number(value);
    }
    if (field.type.endsWith('[]')) {
      return value.map((v: any) =>
        this.formatField(
          { name: '', internalType: '', type: field.type.slice(0, -2) },
          v,
        ),
      );
    }
    if (field.type === 'tuple') {
      return value.reduce((acc: any, v: any, index: number) => {
        acc[field.components[index].name] = this.formatField(
          field.components[index],
          v,
        );
        return acc;
      }, {});
    }

    return value;
  }

  private formatResponse(methodName: string, response: Result): Object {
    const methodAbi = this.getMethodAbi(methodName);
    if (!methodAbi) return null;

    const outputsAbi = methodAbi.outputs;

    // No outputs defined in ABI, return response as is:
    if (!outputsAbi?.length) return null;

    // Returned value is a single value:
    if (outputsAbi[0].name === '') {
      return this.formatField(outputsAbi[0], response);
    }

    // Returned value is a tuple or struct:
    // Format response according to ABI. Future improvement: this formatter only works for simple types,
    // in case you have complex types like structs, you should implement a recursive function to format the response.
    const formattedResponse = outputsAbi.reduce((acc, output, index) => {
      acc[output.name] = this.formatField(output, response[index]);
      return acc;
    }, {});

    return formattedResponse;
  }

  private async callContractMethod(methodName: string, args: any[]) {
    try {
      const method = this.contract.getFunction(methodName);
      const res: Result = await method(...args);
      const data = this.formatResponse(methodName, res);
      return data;
    } catch (err: any) {
      console.error('BLOCKCHAIN TRANSACTION ERROR', err);
      throw new HttpException(
        err?.shortMessage || err?.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createConsent(
    consentId: number,
    creatorId: number,
    activities: UserActivities,
  ): Promise<Object> {
    return this.callContractMethod('createConsent', [
      consentId,
      creatorId,
      activities,
    ]);
  }

  async joinConsent(
    consentId: number,
    userId: number,
    activities: UserActivities,
  ): Promise<Object> {
    return this.callContractMethod('joinConsent', [
      consentId,
      userId,
      activities,
    ]);
  }

  async rejectConsent(consentId: number, userId: number): Promise<Object> {
    return this.callContractMethod('rejectConsent', [consentId, userId]);
  }

  async revokeConsent(consentId: number, userId: number): Promise<Object> {
    return this.callContractMethod('revokeConsent', [consentId, userId]);
  }

  async deleteConsent(consentId: number): Promise<Object> {
    return this.callContractMethod('deleteConsent', [consentId]);
  }

  async updateActivities(
    consentId: number,
    userId: number,
    activities: UserActivities,
  ): Promise<Object> {
    return this.callContractMethod('updateActivities', [
      consentId,
      userId,
      activities,
    ]);
  }

  async getConsent(consentId: number): Promise<Consent> {
    const consent = await this.callContractMethod('consents', [consentId]);
    return consent as Consent;
  }

  async getConsentUsers(consentId: number): Promise<number[]> {
    const users = await this.callContractMethod('getUsers', [consentId]);
    return users as number[];
  }

  async getConsentUserById(
    consentId: number,
    userId: number,
  ): Promise<ConsentUser> {
    const user = await this.callContractMethod('getConsentUser', [
      consentId,
      userId,
    ]);
    return user as ConsentUser;
  }

  async getConsentUserActivities(
    consentId: number,
    userId: number,
  ): Promise<UserActivities> {
    const activities = await this.callContractMethod('getActivities', [
      consentId,
      userId,
    ]);
    return activities as UserActivities;
  }

  async getConsentIntegrity(consentId: number): Promise<string> {
    const hash = await this.callContractMethod('getContentIntegrityHash', [
      consentId,
    ]);
    return hash as string;
  }
}
