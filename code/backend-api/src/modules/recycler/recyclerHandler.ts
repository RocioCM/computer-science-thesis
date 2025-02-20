import { IResult } from 'src/pkg/interfaces/result';
import ConsumerHandler from '../consumer/consumerHandler';
import {
  CreateRecyclingBatchDTO,
  RecycledMaterialBatch,
  SellRecyclingBatchDTO,
  UpdateRecyclingBatchDTO,
} from './domain/recycledMaterialBatch';
import { CreationResponse } from '../producer/domain/baseBatch';
import { StatusCodes } from 'http-status-codes';
import RecycledMaterialBatchRepository from './repositories/recycledMaterialBatchRepository';
import AuthHandler from '../auth/authHandler';
import { Ownership } from './domain/ownership';
import { OWNERSHIP_TYPES } from 'src/pkg/constants/ownership';
import OwnershipRepository from './repositories/ownershipRepository';
import { TrackingOriginResponse } from '../consumer/domain/wasteBottle';

export default class RecyclerHandler {
  static async GetBottleInfoByTrackingCode(
    trackingCode: string,
  ): IResult<TrackingOriginResponse> {
    return ConsumerHandler.GetProductOriginByTrackingCode(trackingCode);
  }

  static async GetAllUserRecyclingBatches(
    firebaseUid: string,
    page: number,
    limit: number,
  ): IResult<RecycledMaterialBatch[]> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const ownershipsListRes =
      await OwnershipRepository.GetOwnershipsByAccountId(
        userRes.data.blockchainId,
        page,
        limit,
      );
    if (!ownershipsListRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const recyclingBatchesIds = ownershipsListRes.data.map(
      (ownership) => ownership.bottleId,
    );

    return RecycledMaterialBatchRepository.GetRecyclingBatchesList(
      recyclingBatchesIds,
    );
  }

  static async GetRecyclingBatchById(
    id: number,
  ): IResult<RecycledMaterialBatch> {
    return RecycledMaterialBatchRepository.GetRecyclingBatchById(id);
  }

  static async CreateRecyclingBatch(
    firebaseUid: string,
    batch: CreateRecyclingBatchDTO,
  ): IResult<CreationResponse> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const creationRes =
      await RecycledMaterialBatchRepository.CreateRecyclingBatch(
        userRes.data.blockchainId,
        batch,
      );
    if (!creationRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    // Create ownership for the creator of the recycled material
    const batchId = creationRes.data;
    const ownership = new Ownership();
    ownership.bottleId = batchId;
    ownership.ownerAccountId = userRes.data.blockchainId;

    const ownershipRes = await OwnershipRepository.CreateOwnership(ownership);
    if (!ownershipRes.ok) {
      // Rollback creation of the batch if ownership creation fails
      await RecycledMaterialBatchRepository.DeleteRecyclingBatch(batchId);
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    return { ok: true, status: StatusCodes.OK, data: { batchId } };
  }

  static async UpdateRecyclingBatch(
    firebaseUid: string,
    batch: UpdateRecyclingBatchDTO,
  ): IResult<null> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes =
      await RecycledMaterialBatchRepository.GetRecyclingBatchById(batch.id);
    if (!batchRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    // Check user is owner of the batch to update
    if (batchRes.data.creator !== userRes.data.blockchainId) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    return RecycledMaterialBatchRepository.UpdateRecyclingBatch(batch);
  }

  static async DeleteRecyclingBatch(
    firebaseUid: string,
    batchId: number,
  ): IResult<null> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes =
      await RecycledMaterialBatchRepository.GetRecyclingBatchById(batchId);
    if (!batchRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    // Check user is owner of the batch to update and not sold
    if (batchRes.data.creator !== userRes.data.blockchainId) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    return RecycledMaterialBatchRepository.DeleteRecyclingBatch(batchId);
  }

  static async SellRecyclingBatch(
    firebaseUid: string,
    batch: SellRecyclingBatchDTO,
  ): IResult<null> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes =
      await RecycledMaterialBatchRepository.GetRecyclingBatchById(
        batch.batchId,
      );
    if (!batchRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    // Check user is owner of the batch to update and not sold
    if (batchRes.data.creator !== userRes.data.blockchainId) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const buyer = await AuthHandler.GetUserByFirebaseUid(batch.buyerUid);
    if (!buyer.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    const sellRes = await RecycledMaterialBatchRepository.SellRecyclingBatch(
      batch.batchId,
      buyer.data.blockchainId,
    );
    if (!sellRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    // Create ownership for the buyer of the recycled material
    const ownership = new Ownership();
    ownership.bottleId = batch.batchId;
    ownership.ownerAccountId = buyer.data.blockchainId;
    ownership.type = OWNERSHIP_TYPES.RECYCLED_SOLD;

    await OwnershipRepository.CreateOwnership(ownership);

    return { ok: true, status: StatusCodes.OK, data: null };
  }
}
