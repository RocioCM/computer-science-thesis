import { StatusCodes } from 'http-status-codes';
import { IResult } from 'src/pkg/interfaces/result';
import AuthHandler from '../auth/authHandler';
import {
  ProductBottlesBatch,
  RecycleBaseBottlesDTO,
  SellProductBottlesDTO,
  SellResponse,
  RecycleResponse,
  UpdateTrackingCodeDTO,
} from './domain/productBatch';
import ProductBottlesBatchRepository from './repositories/productBottlesBatchRepository';
import OwnershipRepository from './repositories/ownershipRepository';
import ProducerHandler from '../producer/producerHandler';
import { BaseBottlesBatch } from '../producer/domain/baseBatch';
import { Ownership } from './domain/ownership';
import { OWNERSHIP_TYPES } from 'src/pkg/constants/ownership';
import { ROLES } from 'src/pkg/constants';

export default class SecondaryProducerHandler {
  static async GetBatchById(batchId: number): IResult<ProductBottlesBatch> {
    return ProductBottlesBatchRepository.GetBatchById(batchId);
  }

  static async GetBatchByTrackingCode(
    trackingCode: string,
  ): IResult<ProductBottlesBatch> {
    return ProductBottlesBatchRepository.GetBatchByTrackingCode(
      trackingCode.toUpperCase(),
    );
  }

  static async GetBaseBatchById(batchId: number): IResult<BaseBottlesBatch> {
    return ProducerHandler.GetBatchById(batchId);
  }

  static async GetAllBatchesByUser(
    firebaseUid: string,
    page: number,
    limit: number,
  ): IResult<ProductBottlesBatch[]> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchesListRes = await OwnershipRepository.GetOwnershipsByAccountId(
      userRes.data.blockchainId,
      page,
      limit,
    );
    if (!batchesListRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const userBatchesIds = batchesListRes.data.map((batch) => batch.bottleId);
    return ProductBottlesBatchRepository.GetBatchesList(userBatchesIds);
  }

  static async UpdateProductBatchTrackingCode(
    firebaseUid: string,
    batch: UpdateTrackingCodeDTO,
  ): IResult<null> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes = await ProductBottlesBatchRepository.GetBatchById(batch.id);
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

    return ProductBottlesBatchRepository.UpdateTrackingCode(
      batch.id,
      batch.trackingCode.toUpperCase().trim(),
    );
  }

  static async DeleteProductBatchTrackingCode(
    firebaseUid: string,
    batchId: number,
  ): IResult<null> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes = await ProductBottlesBatchRepository.GetBatchById(batchId);
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

    return ProductBottlesBatchRepository.DeleteProductBatchTrackingCode(
      batchId,
    );
  }

  static async RejectBaseBottlesBatch(
    firebaseUid: string,
    batchId: number,
  ): IResult<null> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes = await ProductBottlesBatchRepository.GetBatchById(batchId);
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
      await ProductBottlesBatchRepository.RejectBaseBottlesBatch(batchId);
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

  static async RecycleBaseBottles(
    firebaseUid: string,
    batch: RecycleBaseBottlesDTO,
  ): IResult<RecycleResponse> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes = await ProductBottlesBatchRepository.GetBatchById(
      batch.productBatchId,
    );
    if (!batchRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    const baseBatchRes = await SecondaryProducerHandler.GetBaseBatchById(
      batchRes.data.originBaseBatchId,
    );
    if (!baseBatchRes.ok) {
      return baseBatchRes;
    }

    // Check user is owner of the batch to update
    if (
      batchRes.data.owner.toLowerCase() !==
      userRes.data.blockchainId.toLowerCase()
    ) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const recycleRes =
      await ProductBottlesBatchRepository.RecycleProductBottles(
        batch.productBatchId,
        batch.quantity,
      );
    if (!recycleRes.ok || !recycleRes.data) {
      return {
        ok: false,
        status: recycleRes.ok
          ? StatusCodes.INTERNAL_SERVER_ERROR
          : recycleRes.status,
        data: null,
      };
    }

    const recyclingBatchId = recycleRes.data;
    const ownership = new Ownership();
    ownership.bottleId = recyclingBatchId;
    ownership.originBatchId = baseBatchRes.data.id;
    ownership.ownerAccountId = baseBatchRes.data.owner;
    ownership.type = OWNERSHIP_TYPES.RECYCLED;

    const ownershipRes = await OwnershipRepository.CreateOwnership(ownership);
    if (!ownershipRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    ownership.type = OWNERSHIP_TYPES.RECYCLED_SOLD;
    ownership.originBatchId = recyclingBatchId;

    const ownershipRes2 = await OwnershipRepository.CreateOwnership(ownership);
    if (!ownershipRes2.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    return {
      ok: true,
      status: StatusCodes.OK,
      data: { recyclingBatchId },
    };
  }

  static async SellProductBottles(
    firebaseUid: string,
    sellData: SellProductBottlesDTO,
  ): IResult<SellResponse> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes = await ProductBottlesBatchRepository.GetBatchById(
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

    const sellRes = await ProductBottlesBatchRepository.SellProductBottle(
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
    const soldProductId = sellRes.data;
    const ownership = new Ownership();
    ownership.bottleId = soldProductId;
    ownership.originBatchId = sellData.batchId;
    ownership.ownerAccountId = buyerUserRes.data.blockchainId;
    ownership.type = OWNERSHIP_TYPES.SOLD;

    await OwnershipRepository.CreateOwnership(ownership);

    return { ok: true, status: StatusCodes.OK, data: { soldProductId } };
  }

  static async GetFilteredBuyers(searchQuery: string) {
    const usersRes = await AuthHandler.GetFilteredUsers(
      searchQuery,
      ROLES.BUYER,
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
}
