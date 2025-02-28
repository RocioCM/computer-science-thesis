import { StatusCodes } from 'http-status-codes';
import { IResult } from 'src/pkg/interfaces/result';
import AuthHandler from '../auth/authHandler';
import {
  ProductBottlesBatch,
  RecycleBaseBottlesDTO,
  SellProductBottlesDTO,
  SellResponse,
  SoldProductBatch,
  UpdateTrackingCodeDTO,
} from './domain/productBatch';
import ProductBottlesBatchRepository from './repositories/productBottlesBatchRepository';
import OwnershipRepository from './repositories/ownershipRepository';
import ProducerHandler from '../producer/producerHandler';
import { BaseBottlesBatch } from '../producer/domain/baseBatch';
import { Ownership } from './domain/ownership';
import { OWNERSHIP_TYPES } from 'src/pkg/constants/ownership';

export default class SecondaryProducerHandler {
  static async GetBatchById(batchId: number): IResult<ProductBottlesBatch> {
    return ProductBottlesBatchRepository.GetBatchById(batchId);
  }

  static async GetBatchByTrackingCode(
    trackingCode: string,
  ): IResult<ProductBottlesBatch> {
    return ProductBottlesBatchRepository.GetBatchByTrackingCode(trackingCode);
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
    if (batchRes.data.owner !== userRes.data.blockchainId) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    return ProductBottlesBatchRepository.UpdateTrackingCode(
      batch.id,
      batch.trackingCode,
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
    if (batchRes.data.owner !== userRes.data.blockchainId) {
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
    if (batchRes.data.owner !== userRes.data.blockchainId) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    return ProductBottlesBatchRepository.RejectBaseBottlesBatch(batchId);
  }

  static async RecycleBaseBottles(
    firebaseUid: string,
    batch: RecycleBaseBottlesDTO,
  ): IResult<null> {
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

    // Check user is owner of the batch to update
    if (batchRes.data.owner !== userRes.data.blockchainId) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    return ProductBottlesBatchRepository.RecycleProductBottles(
      batch.productBatchId,
      batch.quantity,
    );
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

    const sellRes = await ProductBottlesBatchRepository.SellProductBottle(
      sellData.batchId,
      sellData.quantity,
      buyerUserRes.data.blockchainId,
    );

    if (!sellRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    // After successful selling, register new product bottles ownership.
    const soldProductId = sellRes.data;
    const ownership = new Ownership();
    ownership.bottleId = soldProductId;
    ownership.ownerAccountId = buyerUserRes.data.blockchainId;
    ownership.type = OWNERSHIP_TYPES.SOLD;

    await OwnershipRepository.CreateOwnership(ownership);

    return { ok: true, status: StatusCodes.OK, data: { soldProductId } };
  }
}
