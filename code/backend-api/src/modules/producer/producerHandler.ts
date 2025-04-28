import { StatusCodes } from 'http-status-codes';
import { IResult } from 'src/pkg/interfaces/result';
import {
  BaseBottlesBatch,
  CreateBaseBottlesBatchDTO,
  CreationResponse,
  SellBaseBottlesDTO,
  SellResponse,
  UpdateBaseBottlesBatchDTO,
} from './domain/baseBatch';
import AuthHandler from '../auth/authHandler';
import BaseBottlesBatchRepository from './repositories/baseBottlesBatchRepository';
import OwnershipRepository from './repositories/ownershipRepository';
import { Ownership } from './domain/ownership';
import { OWNERSHIP_TYPES } from 'src/pkg/constants/ownership';
import { ROLES } from 'src/pkg/constants';
import RecyclerHandler from '../recycler/recyclerHandler';

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
  ): IResult<CreationResponse> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchEntity = new BaseBottlesBatch();
    batchEntity.quantity = batch.quantity;
    batchEntity.owner = userRes.data.blockchainId;
    batchEntity.bottleType = batch.bottleType;
    batchEntity.createdAt = batch.createdAt;
    batchEntity.soldQuantity = 0;
    batchEntity.deletedAt = '';

    const creationRes =
      await BaseBottlesBatchRepository.CreateBaseBottlesBatch(batchEntity);
    if (!creationRes.ok || !creationRes.data) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const batchId = creationRes.data;
    const ownership = new Ownership();
    ownership.bottleId = batchId;
    ownership.originBatchId = 0;
    ownership.ownerAccountId = userRes.data.blockchainId;

    const ownershipRes = await OwnershipRepository.CreateOwnership(ownership);
    if (!ownershipRes.ok) {
      // Revert full transaction if incomplete:
      await BaseBottlesBatchRepository.DeleteBaseBottlesBatch(batchId);
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    return {
      ok: true,
      status: StatusCodes.CREATED,
      data: { batchId },
    };
  }

  static async UpdateBaseBottlesBatch(
    firebaseUid: string,
    batch: UpdateBaseBottlesBatchDTO,
  ): IResult<null> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes = await BaseBottlesBatchRepository.GetBatchById(batch.id);
    if (!batchRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    // Check user is owner of the batch to update
    if (
      batchRes.data.owner.toLowerCase() !==
      userRes.data.blockchainId.toLowerCase()
    ) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const updatedBatch = batchRes.data;
    updatedBatch.bottleType = batch.bottleType;
    updatedBatch.quantity = batch.quantity;
    updatedBatch.createdAt = batch.createdAt;

    return BaseBottlesBatchRepository.UpdateBaseBottlesBatch(updatedBatch);
  }

  static async DeleteBaseBottlesBatch(
    firebaseUid: string,
    batchId: number,
  ): IResult<null> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes = await BaseBottlesBatchRepository.GetBatchById(batchId);
    if (!batchRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    // Check user is owner of the batch to update
    if (
      batchRes.data.owner.toLowerCase() !==
      userRes.data.blockchainId.toLowerCase()
    ) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const deleteRes =
      await BaseBottlesBatchRepository.DeleteBaseBottlesBatch(batchId);
    if (!deleteRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const ownershipRes =
      await OwnershipRepository.GetOwnershipByBottleId(batchId);
    if (ownershipRes.ok) {
      // Error is not handled as it is not critical to delete ownership.
      await OwnershipRepository.DeleteOwnershipById(ownershipRes.data.id);
    }

    return { ok: true, status: StatusCodes.OK, data: null };
  }

  static async SellBaseBottles(
    firebaseUid: string,
    sellData: SellBaseBottlesDTO,
  ): IResult<SellResponse> {
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
    if (
      batchRes.data.owner.toLowerCase() !==
      userRes.data.blockchainId.toLowerCase()
    ) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    // Get buyer account id by firebase uid
    const buyerUserRes = await AuthHandler.GetUserByFirebaseUid(
      sellData.buyerUid,
    );
    if (!buyerUserRes.ok) {
      return { ok: false, status: StatusCodes.BAD_REQUEST, data: null };
    }

    const sellRes = await BaseBottlesBatchRepository.SellBaseBottles(
      sellData.batchId,
      sellData.quantity,
      buyerUserRes.data.blockchainId,
    );
    if (!sellRes.ok || !sellRes.data) {
      return {
        ok: false,
        status: sellRes.ok ? StatusCodes.INTERNAL_SERVER_ERROR : sellRes.status,
        data: null,
      };
    }

    // After successful selling, register new product bottles ownership.
    const productBatchId = sellRes.data;
    const ownership = new Ownership();
    ownership.bottleId = productBatchId;
    ownership.originBatchId = sellData.batchId;
    ownership.ownerAccountId = buyerUserRes.data.blockchainId;
    ownership.type = OWNERSHIP_TYPES.PRODUCT;

    await OwnershipRepository.CreateOwnership(ownership);

    return { ok: true, status: StatusCodes.OK, data: { productBatchId } };
  }

  static async RecycleBaseBottlesBatch(
    firebaseUid: string,
    batchId: number,
    quantity: number,
  ): IResult<null> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes = await BaseBottlesBatchRepository.GetBatchById(batchId);
    if (!batchRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    // Check user is owner of the batch to update
    if (
      batchRes.data.owner.toLowerCase() !==
      userRes.data.blockchainId.toLowerCase()
    ) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    return BaseBottlesBatchRepository.RecycleBaseBottlesBatch(
      batchId,
      quantity,
    );
  }

  static async GetFilteredBuyers(searchQuery: string) {
    const usersRes = await AuthHandler.GetFilteredUsers(
      searchQuery,
      ROLES.SECONDARY_PRODUCER,
    );
    if (!usersRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const formattedBuyers = usersRes.data.map((user) => ({
      firebaseUid: user.firebaseUid,
      email: user.email,
      userName: user.userName,
    }));

    return { ok: true, status: StatusCodes.OK, data: formattedBuyers };
  }

  static async GetRecyclingBatchById(id: number) {
    return RecyclerHandler.GetRecyclingBatchById(id);
  }

  static async GetAllUserRecyclingBatches(
    firebaseUid: string,
    page: number,
    limit: number,
  ) {
    return RecyclerHandler.GetAllUserRecyclingBatches(
      firebaseUid,
      page,
      limit,
      true,
    );
  }
}
