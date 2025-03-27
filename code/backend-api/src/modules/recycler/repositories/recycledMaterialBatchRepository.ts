import blockchainHelper from 'src/pkg/helpers/blockchainHelper';
import { getEnv } from 'src/pkg/helpers/env';
import { IResult } from 'src/pkg/interfaces/result';
import { CONTRACT_ABI } from '../constants/abi';
import {
  CreateRecyclingBatchDTO,
  RecycledMaterialBatch,
  UpdateRecyclingBatchDTO,
} from '../domain/recycledMaterialBatch';
import { StatusCodes } from 'http-status-codes';

export default class RecycledMaterialBatchRepository {
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

  static async GetRecyclingBatchById(
    batchId: number,
  ): IResult<RecycledMaterialBatch> {
    const batchRes = await this.callPureContractMethod<RecycledMaterialBatch>(
      'recycledMaterials',
      batchId,
    );
    if (!batchRes.ok) {
      return batchRes;
    }

    const batch: RecycledMaterialBatch = batchRes.data;
    batch.composition = JSON.parse((batch.composition || '[]') as any);
    return { ok: true, status: StatusCodes.OK, data: batch };
  }

  static async GetBottlesIdsListForBatch(batchId: number): IResult<number[]> {
    return this.callPureContractMethod('getWasteBottleIdsForBatch', batchId);
  }

  static async GetRecyclingBatchesList(
    batchesIds: number[],
  ): IResult<RecycledMaterialBatch[]> {
    const batchesRes = await this.callPureContractMethod<
      RecycledMaterialBatch[]
    >('getRecycledMaterialBatchesList', batchesIds);
    if (!batchesRes.ok) {
      return batchesRes;
    }
    const batches = batchesRes.data.map((batch) => {
      batch.composition = JSON.parse((batch.composition || '[]') as any);
      return batch;
    });

    return { ok: true, status: StatusCodes.OK, data: batches };
  }

  static async CreateRecyclingBatch(
    creator: string,
    batch: CreateRecyclingBatchDTO,
  ): IResult<number> {
    const createdAt = new Date().toISOString();
    const composition = JSON.stringify(batch.composition);
    const result = await this.callContractMethod(
      'createRecycledMaterialBatch',
      batch.weight,
      batch.size,
      batch.materialType,
      composition,
      batch.extraInfo,
      creator,
      createdAt,
    );
    if (!result.ok) {
      return result;
    }

    // Get created batch id from events emmited or default to 0.
    const batchId =
      result.data.find((event) => event.name === 'RecycledMaterialBatchCreated')
        ?.args?.[0] ?? 0;

    return { ok: true, status: StatusCodes.OK, data: batchId };
  }

  static async AddWasteBottleToBatch(
    batchId: number,
    bottleId: number,
  ): IResult<null> {
    const res = await this.callContractMethod(
      'addWasteBottleToBatch',
      batchId,
      bottleId,
    );
    return { ...res, data: null };
  }

  static async RemoveWasteBottleFromBatch(
    batchId: number,
    bottleId: number,
  ): IResult<null> {
    const res = await this.callContractMethod(
      'removeWasteBottleFromBatch',
      batchId,
      bottleId,
    );
    return { ...res, data: null };
  }

  static async UpdateRecyclingBatch(
    batch: UpdateRecyclingBatchDTO,
  ): IResult<null> {
    const composition = JSON.stringify(batch.composition);
    const res = await this.callContractMethod(
      'updateRecycledMaterialBatch',
      batch.id,
      batch.weight,
      batch.size,
      batch.materialType,
      composition,
      batch.extraInfo,
    );
    return { ...res, data: null };
  }

  static async DeleteRecyclingBatch(batchId: number): IResult<null> {
    const deletedAt = new Date().toISOString();
    const res = await this.callContractMethod(
      'deleteRecycledMaterialBatch',
      batchId,
      deletedAt,
    );
    return { ...res, data: null };
  }

  static async SellRecyclingBatch(
    batchId: number,
    buyer: string,
  ): IResult<null> {
    const res = await this.callContractMethod(
      'sellRecycledMaterialBatch',
      batchId,
      buyer,
    );
    return { ...res, data: null };
  }
}
