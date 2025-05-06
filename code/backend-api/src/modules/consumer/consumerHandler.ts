import { StatusCodes } from 'http-status-codes';
import { IResult } from 'src/pkg/interfaces/result';
import {
  CreateWasteBottleDTO,
  CreationResponse,
  WasteBottle,
  TrackingOriginResponse,
  TrackingRecyclingResponse,
} from './domain/wasteBottle';
import WasteBottleRepository from './repositories/wasteBottleRepository';
import AuthHandler from '../auth/authHandler';
import { Watcher } from './domain/watcher';
import { Ownership } from './domain/ownership';
import WatcherRepository from './repositories/watcherRepository';
import OwnershipRepository from './repositories/ownershipRepository';
import SecondaryProducerHandler from '../secondaryProducer/secondaryProducerHandler';
import RecyclerHandler from '../recycler/recyclerHandler';
import { ROLES } from 'src/pkg/constants';

export default class ConsumerHandler {
  static async GetProductOriginByTrackingCode(
    trackingCode: string,
  ): IResult<TrackingOriginResponse> {
    const productBottleRes =
      await SecondaryProducerHandler.GetBatchByTrackingCode(trackingCode);
    if (!productBottleRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }
    if (
      productBottleRes.data.availableQuantity >= productBottleRes.data.quantity
    ) {
      // Keep batches private until they are sold
      return {
        ok: false,
        status: StatusCodes.NOT_FOUND,
        data: null,
      };
    }

    const baseBatchRes = await SecondaryProducerHandler.GetBaseBatchById(
      productBottleRes.data.originBaseBatchId,
    );
    if (!baseBatchRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
    if (baseBatchRes.data.soldQuantity <= 0) {
      // Keep batches private until they are sold
      return {
        ok: false,
        status: StatusCodes.NOT_FOUND,
        data: null,
      };
    }

    const primaryProducerRes = await AuthHandler.GetUserByBlockchainId(
      baseBatchRes.data.owner,
    );
    const baseOwnerName = primaryProducerRes.ok
      ? primaryProducerRes.data.userName
      : '';
    const secondaryProducerRes = await AuthHandler.GetUserByBlockchainId(
      productBottleRes.data.owner,
    );
    const productOwnerName = secondaryProducerRes.ok
      ? secondaryProducerRes.data.userName
      : '';

    const stages: TrackingOriginResponse = [
      {
        stage: 'base',
        data: {
          ...baseBatchRes.data,
          ownerName: baseOwnerName ?? '',
        },
      },
      {
        stage: 'product',
        data: {
          ...productBottleRes.data,
          ownerName: productOwnerName ?? '',
        },
      },
    ];

    return { ok: true, status: StatusCodes.OK, data: stages };
  }

  static async GetWasteBottleById(bottleId: number): IResult<WasteBottle> {
    return WasteBottleRepository.GetWasteBottleById(bottleId);
  }

  static async GetWasteBottleTracking(
    bottleId: number,
  ): IResult<TrackingRecyclingResponse> {
    const wasteBottleRes =
      await WasteBottleRepository.GetWasteBottleById(bottleId);
    if (!wasteBottleRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    const stages: TrackingRecyclingResponse = [
      {
        stage: 'pickup',
        data: wasteBottleRes.data,
      },
    ];

    if (!!wasteBottleRes.data.recycledBatchId) {
      const recycledBatchRes = await RecyclerHandler.GetRecyclingBatchById(
        wasteBottleRes.data.recycledBatchId,
      );
      if (recycledBatchRes.ok) {
        stages.push({ stage: 'recycling', data: recycledBatchRes.data });
      }
    }

    return { ok: true, status: StatusCodes.OK, data: stages };
  }

  static async GetAllUserWasteBottles(
    firebaseUid: string,
    page: number,
    limit: number,
  ): IResult<WasteBottle[]> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const watchersListRes = await WatcherRepository.GetWatchersByUserId(
      userRes.data.blockchainId,
      page,
      limit,
    );
    if (!watchersListRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const wasteBottlesIds = watchersListRes.data.map(
      (watcher) => watcher.wasteBottleId,
    );

    return WasteBottleRepository.GetWasteBottlesList(wasteBottlesIds);
  }

  static async GetWasteBottlesList(wasteBottlesIds: number[]) {
    return WasteBottleRepository.GetWasteBottlesList(wasteBottlesIds);
  }

  static async GetFilteredRecyclers(searchQuery: string) {
    const usersRes = await AuthHandler.GetFilteredUsers(
      searchQuery,
      ROLES.RECYCLER,
    );
    if (!usersRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const formattedRecyclers = usersRes.data.map((user) => ({
      firebaseUid: user.firebaseUid,
      email: user.email,
      userName: user.userName,
    }));

    return { ok: true, status: StatusCodes.OK, data: formattedRecyclers };
  }

  static async CreateWasteBottle(
    firebaseUid: string,
    wasteBottle: CreateWasteBottleDTO,
  ): IResult<CreationResponse> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const ownerRes = await AuthHandler.GetUserByFirebaseUid(wasteBottle.owner);
    if (!ownerRes.ok) {
      return { ok: false, status: StatusCodes.BAD_REQUEST, data: null };
    }

    const batchRes = await SecondaryProducerHandler.GetBatchByTrackingCode(
      wasteBottle.trackingCode,
    );
    if (!batchRes.ok) {
      return { ok: false, status: StatusCodes.BAD_REQUEST, data: null };
    }
    if (batchRes.data.availableQuantity >= batchRes.data.quantity) {
      // Keep batches private until they are sold
      return {
        ok: false,
        status: StatusCodes.NOT_FOUND,
        data: null,
      };
    }

    const createdBottleRes = await WasteBottleRepository.CreateWasteBottle(
      wasteBottle.trackingCode,
      ownerRes.data.blockchainId,
      userRes.data.blockchainId,
    );
    if (!createdBottleRes.ok || !createdBottleRes.data) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    // Create watcher for the created bottle.
    const wasteBottleId = createdBottleRes.data;
    const watcher = new Watcher();
    watcher.userAccountId = userRes.data.blockchainId;
    watcher.wasteBottleId = wasteBottleId;

    const watcherRes = await WatcherRepository.CreateWatcher(watcher);
    if (!watcherRes.ok) {
      // Rollback the bottle creation if the watcher creation fails.
      await WasteBottleRepository.DeleteWasteBottle(wasteBottleId);
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    // Create ownership for the created bottle.
    const ownership = new Ownership();
    ownership.originBatchId = batchRes.data.id;
    ownership.ownerAccountId = ownerRes.data.blockchainId;
    ownership.bottleId = wasteBottleId;

    const ownershipRes = await OwnershipRepository.CreateOwnership(ownership);
    if (!ownershipRes.ok) {
      // Rollback the bottle creation if the ownership creation fails.
      await WasteBottleRepository.DeleteWasteBottle(wasteBottleId);
      await WatcherRepository.DeleteWatcher(watcher.id);
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    return {
      ok: true,
      status: StatusCodes.OK,
      data: {
        bottleId: wasteBottleId,
      },
    };
  }

  static async DeleteWasteBottle(
    firebaseUid: string,
    wasteBottleId: number,
  ): IResult<null> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const wasteBottleRes =
      await WasteBottleRepository.GetWasteBottleById(wasteBottleId);
    if (!wasteBottleRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    // Check user is owner of the bottle to delete
    if (
      wasteBottleRes.data.creator.toLowerCase() !==
      userRes.data.blockchainId.toLowerCase()
    ) {
      return { ok: false, status: StatusCodes.FORBIDDEN, data: null };
    }

    // Check if bottle is already recycled
    if (!!wasteBottleRes.data.recycledBatchId) {
      return {
        ok: false,
        status: StatusCodes.CONFLICT,
        data: null,
      };
    }

    const deleteRes =
      await WasteBottleRepository.DeleteWasteBottle(wasteBottleId);
    if (!deleteRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    await WatcherRepository.DeleteWatcherByBottleId(wasteBottleId);
    await OwnershipRepository.DeleteOwnershipByUserAndBottleId(
      wasteBottleRes.data.owner.toLowerCase(),
      wasteBottleId,
    );

    return { ok: true, status: StatusCodes.OK, data: null };
  }
}
