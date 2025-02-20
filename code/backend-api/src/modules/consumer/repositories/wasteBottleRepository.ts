import { getEnv } from 'src/pkg/helpers/env';
import { IResult } from 'src/pkg/interfaces/result';
import blockchainHelper from 'src/pkg/helpers/blockchainHelper';
import { CONTRACT_ABI } from '../constants/abi';
import { WasteBottle } from '../domain/wasteBottle';
import { StatusCodes } from 'http-status-codes';

export default class WasteBottleRepository {
  private static async callContractMethod(methodName: string, ...args: any[]) {
    return blockchainHelper.callContractMethod(
      getEnv('RECYCLING_CONTRACT_ADDRESS'),
      CONTRACT_ABI,
      methodName,
      ...args,
    );
  }

  private static async callPureContractMethod<T = null>(
    methodName: string,
    ...args: any[]
  ): IResult<T> {
    return blockchainHelper.callPureContractMethod<T>(
      getEnv('RECYCLING_CONTRACT_ADDRESS'),
      CONTRACT_ABI,
      methodName,
      ...args,
    );
  }

  static async GetWasteBottleById(bottleId: number): IResult<WasteBottle> {
    return this.callPureContractMethod<WasteBottle>('wasteBottles', bottleId);
  }

  static async GetWasteBottlesList(
    bottleIds: number[],
  ): IResult<WasteBottle[]> {
    return this.callPureContractMethod<WasteBottle[]>(
      'getWasteBottlesList',
      bottleIds,
    );
  }

  static async CreateWasteBottle(
    trackingCode: string,
    owner: string,
    creator: string,
  ): IResult<number> {
    const createdAt = new Date().toISOString();
    const res = await this.callContractMethod(
      'createWasteBottle',
      trackingCode,
      owner,
      creator,
      createdAt,
    );

    ///
    return { ok: true, status: StatusCodes.OK, data: 0 };
  }

  static async DeleteWasteBottle(bottleId: number): IResult<null> {
    const res = await this.callContractMethod('deleteWasteBottle', bottleId);
    return { ...res, data: null };
  }
}
