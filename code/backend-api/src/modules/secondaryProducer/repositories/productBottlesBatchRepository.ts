import { IResult } from 'src/pkg/interfaces/result';
import { getEnv } from 'src/pkg/helpers/env';
import blockchainHelper from 'src/pkg/helpers/blockchainHelper';
import { ProductBottlesBatch } from '../domain/productBatch';
import { CONTRACT_ABI } from '../constants/abi';
import { StatusCodes } from 'http-status-codes';
import { ERRORS } from 'src/pkg/constants';

export default class ProductBottlesBatchRepository {
  private static async callContractMethod(methodName: string, ...args: any[]) {
    return blockchainHelper.callContractMethod(
      getEnv('PRODUCT_BATCH_CONTRACT_ADDRESS'),
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
      getEnv('PRODUCT_BATCH_CONTRACT_ADDRESS'),
      CONTRACT_ABI,
      methodName,
      ...args,
    );
  }

  static async GetBatchById(batchId: number): IResult<ProductBottlesBatch> {
    const batchRes = await this.callPureContractMethod<ProductBottlesBatch>(
      'productBottles',
      batchId,
    );
    if (!batchRes.ok || !batchRes.data.id) {
      return {
        ok: false,
        status: batchRes.ok ? StatusCodes.NOT_FOUND : batchRes.status,
        data: null,
      };
    }
    return batchRes;
  }

  static async GetBatchByTrackingCode(
    trackingCode: string,
  ): IResult<ProductBottlesBatch> {
    return this.callPureContractMethod<ProductBottlesBatch>(
      'getProductBottleByCode',
      trackingCode,
    );
  }

  static async GetBatchesList(
    batchesIds: number[],
  ): IResult<ProductBottlesBatch[]> {
    return this.callPureContractMethod<ProductBottlesBatch[]>(
      'getProductBottlesList',
      batchesIds,
    );
  }

  static async UpdateTrackingCode(
    batchId: number,
    trackingCode: string,
  ): IResult<null> {
    const res = await this.callContractMethod(
      'updateTrackingCode',
      batchId,
      trackingCode,
    );
    if (!res.ok && res.data?.toLowerCase().includes('already in use')) {
      return { ok: false, status: StatusCodes.CONFLICT, data: null };
    }
    return { ...res, data: null };
  }

  static async DeleteProductBatchTrackingCode(batchId: number): IResult<null> {
    const res = await this.callContractMethod('deleteTrackingCode', batchId);
    return { ...res, data: null };
  }

  static async RejectBaseBottlesBatch(batchId: number): IResult<null> {
    const res = await this.callContractMethod('rejectBaseBottles', batchId);
    return { ...res, data: null };
  }

  static async RecycleProductBottles(
    batchId: number,
    quantity: number,
  ): IResult<number> {
    const res = await this.callContractMethod(
      'recycleProductBottles',
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
      res.data.find((event) => event.name === 'ProductBottlesRecycled')
        ?.args?.[1] ?? 0;

    return { ok: true, status: StatusCodes.OK, data: recyclingBatchId };
  }

  static async SellProductBottle(
    batchId: number,
    quantity: number,
    buyer: string,
  ): IResult<number> {
    const selledAt = new Date().toISOString();
    const result = await this.callContractMethod(
      'sellProductBottle',
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

    // Get created sold batch id from events emmited or default to 0.
    const soldBatchId =
      result.data.find((event) => event.name === 'ProductBottlesSold')
        ?.args?.[1] ?? 0;

    return { ok: true, status: StatusCodes.OK, data: soldBatchId };
  }
}
