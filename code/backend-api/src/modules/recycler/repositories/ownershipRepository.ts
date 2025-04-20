import { StatusCodes } from 'http-status-codes';
import databaseHelper from 'src/pkg/helpers/databaseHelper';
import { IResult } from 'src/pkg/interfaces/result';
import { OWNERSHIP_TYPES } from 'src/pkg/constants/ownership';
import { Ownership } from '../domain/ownership';

export default class OwnershipRepository {
  static async CreateOwnership(ownership: Ownership): IResult<Ownership> {
    if (!ownership.type) ownership.type = OWNERSHIP_TYPES.RECYCLED;

    const createdOwner = await databaseHelper
      .db()
      .manager.save(Ownership, ownership);
    if (!createdOwner?.id) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
    return { ok: true, status: StatusCodes.CREATED, data: createdOwner };
  }

  static async GetOwnershipsByAccountId(
    ownerAccountId: string,
    page: number,
    limit: number,
    type?: string,
  ): IResult<Ownership[]> {
    const take = limit || 10; // Default limit to 10 if not provided
    const skip = (page - 1) * take;

    const ownerships = await databaseHelper.db().manager.find(Ownership, {
      where: { ownerAccountId, type: type || OWNERSHIP_TYPES.RECYCLED },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return { ok: true, status: StatusCodes.OK, data: ownerships };
  }

  static async DeleteOwnershipByUserAndBatchId(
    ownerAccountId: string,
    batchId: number,
  ): IResult<null> {
    const deleteStatus = await databaseHelper.db().manager.delete(Ownership, {
      ownerAccountId,
      bottleId: batchId,
      type: OWNERSHIP_TYPES.RECYCLED,
    });
    if (deleteStatus.affected === 0) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }
    return { ok: true, status: StatusCodes.OK, data: null };
  }
}
