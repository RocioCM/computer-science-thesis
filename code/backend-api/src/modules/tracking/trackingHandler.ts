import { StatusCodes } from 'http-status-codes';
import AuthHandler from '../auth/authHandler';
import { UserPublicProfileDTO } from './domain/user';
import { IResult } from 'src/pkg/interfaces/result';
import ProducerHandler from '../producer/producerHandler';
import SecondaryProducerHandler from '../secondaryProducer/secondaryProducerHandler';
import ConsumerHandler from '../consumer/consumerHandler';
import RecyclerHandler from '../recycler/recyclerHandler';
import OwnershipRepository from './repositories/ownershipRepository';
import { OWNERSHIP_TYPES } from 'src/pkg/constants/ownership';

export default class TrackingHandler {
  static async GetUserPublicData(
    blockchainId: string,
  ): IResult<UserPublicProfileDTO> {
    const userRes = await AuthHandler.GetUserByBlockchainId(blockchainId);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    const user = userRes.data;
    const userPublicData: UserPublicProfileDTO = {
      blockchainId: user.blockchainId,
      email: user.email,
      userName: user.userName,
      phone: user.phone,
    };
    return { ok: true, status: StatusCodes.OK, data: userPublicData };
  }

  static async GetBaseBottlesBatchById(batchId: number) {
    const batchRes = await ProducerHandler.GetBatchById(batchId);
    if (!batchRes.ok) {
      return batchRes;
    }
    if (batchRes.data.soldQuantity <= 0) {
      // Keep batches private until they are sold
      return {
        ok: false,
        status: StatusCodes.NOT_FOUND,
        data: null,
      };
    }
    return batchRes;
  }

  static async GetAllProductsFromBaseBatch(
    batchId: number,
    page: number,
    limit: number,
  ) {
    const ownershipsRes = await OwnershipRepository.GetOwnershipsWithFilters(
      {
        type: OWNERSHIP_TYPES.PRODUCT,
        originBatchId: batchId,
      },
      page,
      limit,
    );
    if (!ownershipsRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const productsIdsList: number[] = ownershipsRes.data.map(
      (ownership) => ownership.bottleId,
    );

    return {
      ok: true,
      status: StatusCodes.OK,
      data: productsIdsList,
    };
  }

  static async GetProductBatchById(batchId: number) {
    return SecondaryProducerHandler.GetBatchById(batchId);
  }

  static async GetProductBatchByTrackingCode(trackingCode: string) {
    const batchRes =
      await SecondaryProducerHandler.GetBatchByTrackingCode(trackingCode);
    if (!batchRes.ok) {
      return batchRes;
    }
    if (batchRes.data.availableQuantity === batchRes.data.quantity) {
      // Keep batches private until they are sold.
      return {
        ok: false,
        status: StatusCodes.NOT_FOUND,
        data: null,
      };
    }

    return batchRes;
  }

  static async GetAllWasteBottlesFromProductBatch(
    batchId: number,
    page: number,
    limit: number,
  ) {
    const ownershipsRes = await OwnershipRepository.GetOwnershipsWithFilters(
      {
        type: OWNERSHIP_TYPES.WASTE,
        originBatchId: batchId,
      },
      page,
      limit,
    );
    if (!ownershipsRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const wasteBottlesIdsList: number[] = ownershipsRes.data.map(
      (ownership) => ownership.bottleId,
    );

    return {
      ok: true,
      status: StatusCodes.OK,
      data: wasteBottlesIdsList,
    };
  }

  static async GetWasteBottleById(bottleId: number) {
    return ConsumerHandler.GetWasteBottleById(bottleId);
  }

  static async GetRecyclingBatchById(batchId: number) {
    return RecyclerHandler.GetRecyclingBatchById(batchId);
  }

  static async GetAllWasteBottlesFromRecyclingBatch(
    batchId: number,
    page: number,
    limit: number,
  ) {
    const bottlesRes = await RecyclerHandler.GetBottlesIdsListForBatch(batchId);
    if (!bottlesRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    // Encode pagination:
    const bottlesIds = bottlesRes.data.slice((page - 1) * limit, page * limit);
    const wasteBottlesList: any[] = [];
    for (const bottleId of bottlesIds) {
      const wasteBottle = await ConsumerHandler.GetWasteBottleById(bottleId);
      if (!wasteBottle.ok) {
        return {
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        };
      }
      wasteBottlesList.push(wasteBottle.data);
    }
    return {
      ok: true,
      status: StatusCodes.OK,
      data: wasteBottlesList,
    };
  }
}
