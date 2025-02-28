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

export default class ConsumerHandler {
  static async GetProductOriginByTrackingCode(
    trackingCode: string,
  ): IResult<TrackingOriginResponse> {
    const productBottleRes =
      await SecondaryProducerHandler.GetBatchByTrackingCode(trackingCode);
    if (!productBottleRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
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

    const stages: TrackingOriginResponse = [
      { stage: 'base', data: baseBatchRes.data },
      { stage: 'product', data: productBottleRes.data },
    ];

    return { ok: true, status: StatusCodes.OK, data: stages };
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

    const createdBottleRes = await WasteBottleRepository.CreateWasteBottle(
      wasteBottle.trackingCode,
      ownerRes.data.blockchainId,
      userRes.data.blockchainId,
    );
    if (!createdBottleRes.ok) {
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
    ownership.ownerAccountId = userRes.data.blockchainId;
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
      wasteBottleRes.data.owner.toLowerCase() !==
      userRes.data.blockchainId.toLowerCase()
    ) {
      return { ok: false, status: StatusCodes.FORBIDDEN, data: null };
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
      userRes.data.blockchainId,
      wasteBottleId,
    );

    return { ok: true, status: StatusCodes.OK, data: null };
  }
}
