import { StatusCodes } from 'http-status-codes';
import { IResult } from 'src/pkg/interfaces/result';
import {
  BaseBottlesBatch,
  CreateBaseBottlesBatchDTO,
  SellBaseBottlesDTO,
  UpdateBaseBottlesBatchDTO,
} from './domain/baseBatch';
import AuthHandler from '../auth/authHandler';
import BaseBottlesBatchRepository from './repositories/baseBottlesBatchRepository';
import OwnershipRepository from './repositories/ownershipRepository';
import { Ownership } from './domain/ownership';

export default class ProducerHandler {
  static async GetBatchById(batchId: number): IResult<BaseBottlesBatch> {
    return BaseBottlesBatchRepository.GetBatchById(batchId);
  }

  static async GetAllBatchesByUser(
    firebaseUid: string,
    page: number,
    limit: number,
  ): IResult<BaseBottlesBatch[]> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchedListRes = await OwnershipRepository.GetOwnershipsByAccountId(
      userRes.data.blockchainId,
      page,
      limit,
    );
    if (!batchedListRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const userBatchesIds = batchedListRes.data.map((batch) => batch.bottleId);
    return BaseBottlesBatchRepository.GetBatchesList(userBatchesIds);
  }

  static async CreateBaseBottlesBatch(
    firebaseUid: string,
    batch: CreateBaseBottlesBatchDTO,
  ): IResult<BaseBottlesBatch> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchEntity = new BaseBottlesBatch();
    batchEntity.quantity = batch.quantity;
    batchEntity.owner = userRes.data.blockchainId;
    batchEntity.bottleType = batch.bottleType;
    batchEntity.createdAt = new Date().toISOString();
    batchEntity.soldQuantity = 0;
    batchEntity.deletedAt = '';

    const creationRes =
      await BaseBottlesBatchRepository.CreateBaseBottlesBatch(batchEntity);
    if (!creationRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const ownership = new Ownership();
    ownership.bottleId = creationRes.data.id;
    ownership.ownerAccountId = userRes.data.blockchainId;

    const ownershipRes = await OwnershipRepository.CreateOwnership(ownership);
    if (!ownershipRes.ok) {
      // Revert full transaction if incomplete:
      await BaseBottlesBatchRepository.DeleteBaseBottlesBatch(
        creationRes.data.id,
      );
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    return creationRes;
  }

  static async UpdateBaseBottlesBatch(
    firebaseUid: string,
    batch: UpdateBaseBottlesBatchDTO,
  ): IResult<BaseBottlesBatch> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes = await BaseBottlesBatchRepository.GetBatchById(batch.id);
    if (!batchRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    // Check user is owner of the batch to update
    if (batchRes.data.owner !== userRes.data.blockchainId) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const updatedBatch = batchRes.data;
    updatedBatch.bottleType = batch.bottleType;
    updatedBatch.quantity = batch.quantity;

    return BaseBottlesBatchRepository.UpdateBaseBottlesBatch(updatedBatch);
  }

  static async DeleteBaseBottlesBatch(
    firebaseUid: string,
    batchId: number,
  ): IResult<BaseBottlesBatch> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes = await BaseBottlesBatchRepository.GetBatchById(batchId);
    if (!batchRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    // Check user is owner of the batch to update
    if (batchRes.data.owner !== userRes.data.blockchainId) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    return BaseBottlesBatchRepository.DeleteBaseBottlesBatch(batchId);
  }

  static async SellBaseBottles(
    firebaseUid: string,
    sellData: SellBaseBottlesDTO,
  ): IResult<BaseBottlesBatch> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes = await BaseBottlesBatchRepository.GetBatchById(
      sellData.batchId,
    );
    if (!batchRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    // Check user is owner of the batch to update
    if (batchRes.data.owner !== userRes.data.blockchainId) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    // Get buyer account id by firebase uid
    const buyerUserRes = await AuthHandler.GetUserByFirebaseUid(
      sellData.buyerUid,
    );
    if (!buyerUserRes.ok) {
      return { ok: false, status: StatusCodes.BAD_REQUEST, data: null };
    }

    return BaseBottlesBatchRepository.SellBaseBottles(
      sellData.batchId,
      sellData.quantity,
      buyerUserRes.data.blockchainId,
    );
  }

  static async RecycleBaseBottlesBatch(
    firebaseUid: string,
    batchId: number,
    quantity: number,
  ): IResult<BaseBottlesBatch> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes = await BaseBottlesBatchRepository.GetBatchById(batchId);
    if (!batchRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    // Check user is owner of the batch to update
    if (batchRes.data.owner !== userRes.data.blockchainId) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    return BaseBottlesBatchRepository.RecycleBaseBottlesBatch(
      batchId,
      quantity,
    );
  }
}
