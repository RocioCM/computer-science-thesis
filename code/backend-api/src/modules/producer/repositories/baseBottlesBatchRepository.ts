import { IResult } from 'src/pkg/interfaces/result';
import { BaseBottlesBatch } from '../domain/baseBatch';
import { CONTRACT_ABI } from '../constants/abi';
import { getEnv } from 'src/pkg/helpers/env';
import blockchainHelper from 'src/pkg/helpers/blockchainHelper';
import { StatusCodes } from 'http-status-codes';

export default class BaseBottlesBatchRepository {
  private static async callContractMethod(methodName: string, ...args: any[]) {
    return blockchainHelper.callContractMethod(
      getEnv('BASE_BATCH_CONTRACT_ADDRESS'),
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
      getEnv('BASE_BATCH_CONTRACT_ADDRESS'),
      CONTRACT_ABI,
      methodName,
      ...args,
    );
  }

  static async GetBatchById(batchId: number): IResult<BaseBottlesBatch> {
    const batchRes = await this.callPureContractMethod<BaseBottlesBatch>(
      'getBaseBottlesBatch',
      batchId,
    );
    if (!batchRes.ok) {
      return batchRes;
    }

    const batch: BaseBottlesBatch = batchRes.data;
    batch.bottleType.composition = JSON.parse(
      (batch.bottleType.composition || '[]') as any,
    );
    return { ok: true, status: StatusCodes.OK, data: batch };
  }

  static async GetBatchesList(
    batchesIds: number[],
  ): IResult<BaseBottlesBatch[]> {
    const batchesRes = await this.callPureContractMethod<BaseBottlesBatch[]>(
      'getBaseBottlesList',
      batchesIds,
    );
    if (!batchesRes.ok) {
      return batchesRes;
    }
    const batches = batchesRes.data.map((batch) => {
      batch.bottleType.composition = JSON.parse(
        (batch.bottleType.composition || '[]') as any,
      );
      return batch;
    });

    return { ok: true, status: StatusCodes.OK, data: batches };
  }

  static async CreateBaseBottlesBatch(
    batch: BaseBottlesBatch,
  ): IResult<number> {
    const bottleType = {
      ...batch.bottleType,
      composition: JSON.stringify(batch.bottleType.composition),
    };
    const createdAt = batch.createdAt || new Date().toISOString();
    const result = await this.callContractMethod(
      'createBaseBottlesBatch',
      batch.quantity,
      bottleType,
      batch.owner,
      createdAt,
    );
    if (!result.ok) {
      return result;
    }

    // Get created batch id from events emmited or default to 0.
    const batchId =
      result.data.find((event) => event.name === 'BaseBatchCreated')
        ?.args?.[0] ?? 0;

    return { ok: true, status: StatusCodes.OK, data: batchId };
  }

  static async UpdateBaseBottlesBatch(batch: BaseBottlesBatch): IResult<null> {
    const res = await this.callContractMethod(
      'updateBaseBottlesBatch',
      batch.id,
      batch,
    );
    return { ...res, data: null };
  }

  static async DeleteBaseBottlesBatch(batchId: number): IResult<null> {
    const deletedAt = new Date().toISOString();
    const res = await this.callContractMethod(
      'deleteBaseBottlesBatch',
      batchId,
      deletedAt,
    );
    return { ...res, data: null };
  }

  static async SellBaseBottles(
    batchId: number,
    quantity: number,
    buyer: string,
  ): IResult<number> {
    const selledAt = new Date().toISOString();
    const res = await this.callContractMethod(
      'sellBaseBottles',
      batchId,
      quantity,
      buyer,
      selledAt,
    );
    ///
    return { ok: true, status: StatusCodes.OK, data: 0 };
  }

  static async RecycleBaseBottlesBatch(
    batchId: number,
    quantity: number,
  ): IResult<null> {
    const res = await this.callContractMethod(
      'recycleBaseBottles',
      batchId,
      quantity,
    );
    return { ...res, data: null };
  }
}
