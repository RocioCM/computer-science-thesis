import { IResult } from 'src/pkg/interfaces/result';
import { getEnv } from 'src/pkg/helpers/env';
import blockchainHelper from 'src/pkg/helpers/blockchainHelper';
import { ProductBottlesBatch } from '../domain/productBatch';
import { CONTRACT_ABI } from '../constants/abi';

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
    return this.callPureContractMethod<ProductBottlesBatch>(
      'productBottles',
      batchId,
    );
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
  ): IResult<null> {
    const res = await this.callContractMethod(
      'recycleProductBottles',
      batchId,
      quantity,
    );
    return { ...res, data: null };
  }

  static async SellProductBottle(
    batchId: number,
    quantity: number,
    buyer: string,
  ): IResult<number> {
    const selledAt = new Date().toISOString();
    const res = await this.callContractMethod(
      'sellProductBottle',
      batchId,
      quantity,
      buyer,
      selledAt,
    );

    ///
    return { ok: true, status: 200, data: 0 };
  }
}
