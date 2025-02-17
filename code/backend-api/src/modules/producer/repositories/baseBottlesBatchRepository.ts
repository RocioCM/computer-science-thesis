import { IResult } from 'src/pkg/interfaces/result';
import { BaseBottlesBatch } from '../domain/baseBatch';
import { CONTRACT_ABI } from '../constants/abi';
import { getEnv } from 'src/pkg/helpers/env';
import blockchainHelper from 'src/pkg/helpers/blockchainHelper';

export default class BaseBottlesBatchRepository {
  private static async callContractMethod<T>(
    methodName: string,
    ...args: any[]
  ): IResult<T> {
    return blockchainHelper.callContractMethod<T>(
      getEnv('BASE_BATCH_CONTRACT_ADDRESS'),
      CONTRACT_ABI,
      methodName,
      ...args,
    );
  }

  static async GetBatchById(batchId: number): IResult<BaseBottlesBatch> {
    return this.callContractMethod<BaseBottlesBatch>(
      'getBaseBottlesBatch',
      batchId,
    );
  }

  static async GetBatchesList(
    batchesIds: number[],
  ): IResult<BaseBottlesBatch[]> {
    return this.callContractMethod<BaseBottlesBatch[]>(
      'getBaseBottlesList',
      batchesIds,
    );
  }

  static async CreateBaseBottlesBatch(
    batch: BaseBottlesBatch,
  ): IResult<BaseBottlesBatch> {
    const bottleType = {
      ...batch.bottleType,
      composition: JSON.stringify(batch.bottleType.composition),
    };
    const createdAt = new Date().toISOString();
    return this.callContractMethod(
      'createBaseBottlesBatch',
      batch.quantity,
      bottleType,
      batch.owner,
      createdAt,
    );
  }

  static async UpdateBaseBottlesBatch(
    batch: BaseBottlesBatch,
  ): IResult<BaseBottlesBatch> {
    return this.callContractMethod('updateBaseBottlesBatch', batch.id, batch);
  }

  static async DeleteBaseBottlesBatch(
    batchId: number,
  ): IResult<BaseBottlesBatch> {
    const deletedAt = new Date().toISOString();
    return this.callContractMethod(
      'deleteBaseBottlesBatch',
      batchId,
      deletedAt,
    );
  }

  static async SellBaseBottles(
    batchId: number,
    quantity: number,
    buyer: string,
  ): IResult<BaseBottlesBatch> {
    const selledAt = new Date().toISOString();
    return this.callContractMethod(
      'sellBaseBottles',
      batchId,
      quantity,
      buyer,
      selledAt,
    );
  }

  static async RecycleBaseBottlesBatch(
    batchId: number,
    quantity: number,
  ): IResult<BaseBottlesBatch> {
    return this.callContractMethod('recycleBaseBottles', batchId, quantity);
  }
}
