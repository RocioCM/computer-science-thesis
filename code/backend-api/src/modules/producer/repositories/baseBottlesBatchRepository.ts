import { IResult } from 'src/pkg/interfaces/result';
import { BaseBottlesBatch } from '../domain/baseBatch';
import { CONTRACT_ABI } from '../constants/abi';
import { getEnv } from 'src/pkg/helpers/env';
import blockchainHelper from 'src/pkg/helpers/blockchainHelper';
import { StatusCodes } from 'http-status-codes';
import { ERRORS } from 'src/pkg/constants';

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
    if (!batchRes.ok || !batchRes.data.id) {
      return {
        ok: false,
        status: batchRes.ok ? StatusCodes.NOT_FOUND : batchRes.status,
        data: null,
      };
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
    const bottleType = {
      ...batch.bottleType,
      composition: JSON.stringify(batch.bottleType.composition),
    };
    const formattedBatch = {
      ...batch,
      bottleType,
    };
    const res = await this.callContractMethod(
      'updateBaseBottlesBatch',
      batch.id,
      formattedBatch,
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
    const result = await this.callContractMethod(
      'sellBaseBottles',
      batchId,
      quantity,
      buyer,
      selledAt,
    );
    if (!result.ok) {
      if (result.data?.toLowerCase().includes('insufficient quantity')) {
        return {
          ok: false,
          status: StatusCodes.BAD_REQUEST,
          data: ERRORS.INSUFFICIENT_QUANTITY,
        };
      }
      return result;
    }

    // Get created batch id from events emmited or default to 0.
    const productBatchId =
      result.data.find((event) => event.name === 'BaseBottlesSold')
        ?.args?.[2] ?? 0;

    return { ok: true, status: StatusCodes.OK, data: productBatchId };
  }

  static async RecycleBaseBottlesBatch(
    batchId: number,
    quantity: number,
  ): IResult<number> {
    const res = await this.callContractMethod(
      'recycleBaseBottles',
      batchId,
      quantity,
    );
    if (!res.ok) {
      if (res.data?.toLowerCase().includes('insufficient quantity')) {
        return {
          ok: false,
          status: StatusCodes.BAD_REQUEST,
          data: ERRORS.INSUFFICIENT_QUANTITY,
        };
      }
      return res;
    }

    // Get created batch id from events emmited or default to 0.
    const recyclingBatchId =
      res.data.find((event) => event.name === 'BaseBottlesRecycled')
        ?.args?.[1] ?? 0;

    return { ok: true, status: StatusCodes.OK, data: recyclingBatchId };
  }
}
