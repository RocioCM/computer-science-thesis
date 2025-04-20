import { IResult } from 'src/pkg/interfaces/result';
import ConsumerHandler from '../consumer/consumerHandler';
import {
  AssignWasteBottleToBatchDTO,
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
import { ROLES } from 'src/pkg/constants';
import { ZeroAddress } from 'ethers';

export default class RecyclerHandler {
  static async GetBottleInfoByTrackingCode(
    trackingCode: string,
  ): IResult<TrackingOriginResponse> {
    return ConsumerHandler.GetProductOriginByTrackingCode(trackingCode);
  }

  static async GetAllUserWasteBottles(
    firebaseUid: string,
    page: number,
    limit: number,
  ) {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const ownershipsListRes =
      await OwnershipRepository.GetOwnershipsByAccountId(
        userRes.data.blockchainId,
        page,
        limit,
        OWNERSHIP_TYPES.WASTE,
      );
    if (!ownershipsListRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const wasteBottlesIds = ownershipsListRes.data.map(
      (ownership) => ownership.bottleId,
    );

    return ConsumerHandler.GetWasteBottlesList(wasteBottlesIds);
  }

  static async GetUserAvailableWasteBottles(
    firebaseUid: string,
    page: number,
    limit: number,
  ) {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const ownershipsListRes =
      await OwnershipRepository.GetOwnershipsByAccountId(
        userRes.data.blockchainId,
        page,
        limit,
        OWNERSHIP_TYPES.WASTE,
      );
    if (!ownershipsListRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const wasteBottlesIds = ownershipsListRes.data.map(
      (ownership) => ownership.bottleId,
    );

    const wasteBottlesRes =
      await ConsumerHandler.GetWasteBottlesList(wasteBottlesIds);
    if (!wasteBottlesRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const availableBottles = wasteBottlesRes.data.filter(
      (bottle) => bottle.recycledBatchId === 0,
    );

    return { ok: true, status: StatusCodes.OK, data: availableBottles };
  }

  static async GetAllUserRecyclingBatches(
    firebaseUid: string,
    page: number,
    limit: number,
    sold: boolean = false,
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
        sold ? OWNERSHIP_TYPES.RECYCLED_SOLD : OWNERSHIP_TYPES.RECYCLED,
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
    const batchRes =
      await RecycledMaterialBatchRepository.GetRecyclingBatchById(id);
    if (!batchRes.ok) {
      return batchRes;
    }

    const wasteBottlesRes =
      await RecycledMaterialBatchRepository.GetBottlesIdsListForBatch(id);
    if (!wasteBottlesRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    batchRes.data.wasteBottleIds = wasteBottlesRes.data;

    return batchRes;
  }

  static async GetBottlesIdsListForBatch(batchId: number): IResult<number[]> {
    return RecycledMaterialBatchRepository.GetBottlesIdsListForBatch(batchId);
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
    if (!creationRes.ok || !creationRes.data) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const batchId = creationRes.data;

    // Manually add each bottle to the batch on the blockchain
    // This is a workaround because the blockchain contract does not support
    // adding multiple bottles to a batch at once.
    for (const bottleId of batch.wasteBottleIds) {
      const addBottleRes =
        await RecycledMaterialBatchRepository.AddWasteBottleToBatch(
          batchId,
          bottleId,
        );
      if (!addBottleRes.ok) {
        // Rollback creation of the batch if adding bottles fails
        await RecycledMaterialBatchRepository.DeleteRecyclingBatch(batchId);

        // Remove added bottles from the batch.
        for (const addedBottleId of batch.wasteBottleIds) {
          await RecycledMaterialBatchRepository.RemoveWasteBottleFromBatch(
            batchId,
            addedBottleId,
          );
          if (bottleId === addedBottleId) {
            break;
          }
        }

        return {
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        };
      }
    }

    // Create ownership for the creator of the recycled material
    const ownership = new Ownership();
    ownership.bottleId = batchId;
    ownership.originBatchId = 0;
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
    if (
      batchRes.data.creator.toLowerCase() !==
      userRes.data.blockchainId.toLowerCase()
    ) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const updateRes =
      await RecycledMaterialBatchRepository.UpdateRecyclingBatch(batch);
    if (!updateRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const prevBatchWasteBottlesRes =
      await RecycledMaterialBatchRepository.GetBottlesIdsListForBatch(batch.id);
    if (!prevBatchWasteBottlesRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    // Split the bottles to remove and add
    let bottlesToRemove: number[] = prevBatchWasteBottlesRes.data;
    let bottlesToAdd: number[] = [];

    for (const bottleId of batch.wasteBottleIds) {
      if (!prevBatchWasteBottlesRes.data.includes(bottleId)) {
        bottlesToAdd.push(bottleId);
      } else {
        bottlesToRemove = bottlesToRemove.filter((id) => id !== bottleId);
      }
    }

    // Manually remove each previous bottle from the batch on the blockchain
    // This is a workaround because the blockchain contract does not support
    // removing multiple bottles from a batch at once.
    for (const bottleId of bottlesToRemove) {
      const removeBottleRes =
        await RecycledMaterialBatchRepository.RemoveWasteBottleFromBatch(
          batch.id,
          bottleId,
        );
      if (!removeBottleRes.ok) {
        return {
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        };
      }
    }

    // Manually add each bottle to the batch on the blockchain
    // This is a workaround because the blockchain contract does not support
    // adding multiple bottles to a batch at once.
    for (const bottleId of bottlesToAdd) {
      const addBottleRes =
        await RecycledMaterialBatchRepository.AddWasteBottleToBatch(
          batch.id,
          bottleId,
        );
      if (!addBottleRes.ok) {
        return {
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        };
      }
    }

    return { ok: true, status: StatusCodes.OK, data: null };
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
    if (
      batchRes.data.creator.toLowerCase() !==
      userRes.data.blockchainId.toLowerCase()
    ) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const deleteRes =
      await RecycledMaterialBatchRepository.DeleteRecyclingBatch(batchId);
    if (!deleteRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    await OwnershipRepository.DeleteOwnershipByUserAndBatchId(
      userRes.data.blockchainId,
      batchId,
    );

    return { ok: true, status: StatusCodes.OK, data: null };
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
    if (
      batchRes.data.creator.toLowerCase() !==
      userRes.data.blockchainId.toLowerCase()
    ) {
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
    ownership.originBatchId = batch.batchId;
    ownership.ownerAccountId = buyer.data.blockchainId;
    ownership.type = OWNERSHIP_TYPES.RECYCLED_SOLD;

    await OwnershipRepository.CreateOwnership(ownership);

    return { ok: true, status: StatusCodes.OK, data: null };
  }

  static async AssignBottleToBatch(
    firebaseUid: string,
    assign: AssignWasteBottleToBatchDTO,
  ): IResult<null> {
    const userRes = await AuthHandler.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    const batchRes =
      await RecycledMaterialBatchRepository.GetRecyclingBatchById(
        assign.batchId,
      );
    if (!batchRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    // Check user is owner of the batch to update and not sold
    if (
      batchRes.data.creator.toLowerCase() !==
      userRes.data.blockchainId.toLowerCase()
    ) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    // Check batch is not sold
    if (batchRes.data.buyerOwner && batchRes.data.buyerOwner !== ZeroAddress) {
      return { ok: false, status: StatusCodes.CONFLICT, data: null };
    }

    const bottleRes = await ConsumerHandler.GetWasteBottleById(assign.bottleId);
    if (!bottleRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    // Check user is owner of the bottle to assign to the batch.
    if (
      bottleRes.data.owner.toLowerCase() !==
      userRes.data.blockchainId.toLowerCase()
    ) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }

    // Check bottle is not already assigned to a batch
    if (bottleRes.data.recycledBatchId !== 0) {
      return { ok: false, status: StatusCodes.BAD_REQUEST, data: null };
    }

    const assignRes =
      await RecycledMaterialBatchRepository.AddWasteBottleToBatch(
        assign.batchId,
        assign.bottleId,
      );
    if (!assignRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    return { ok: true, status: StatusCodes.OK, data: null };
  }

  static async GetFilteredBuyers(searchQuery: string) {
    const usersRes = await AuthHandler.GetFilteredUsers(
      searchQuery,
      ROLES.PRODUCER,
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
