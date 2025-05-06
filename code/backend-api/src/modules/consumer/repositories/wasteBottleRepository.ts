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
    const bottleRes = await this.callPureContractMethod<WasteBottle>(
      'wasteBottles',
      bottleId,
    );
    if (!bottleRes.ok || !bottleRes.data.id) {
      return {
        ok: false,
        status: bottleRes.ok ? StatusCodes.NOT_FOUND : bottleRes.status,
        data: null,
      };
    }
    return bottleRes;
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
    const result = await this.callContractMethod(
      'createWasteBottle',
      trackingCode,
      owner,
      creator,
      createdAt,
    );
    if (!result.ok) {
      return result;
    }

    // Get created batch id from events emmited or default to 0.
    const productBatchId =
      result.data.find((event) => event.name === 'WasteBottleCreated')
        ?.args?.[0] ?? 0;

    return { ok: true, status: StatusCodes.OK, data: productBatchId };
  }

  static async DeleteWasteBottle(bottleId: number): IResult<null> {
    const deletedAt = new Date().toISOString();
    const res = await this.callContractMethod(
      'deleteWasteBottle',
      bottleId,
      deletedAt,
    );
    return { ...res, data: null };
  }
}
