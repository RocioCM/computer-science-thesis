import { StatusCodes } from 'http-status-codes';
import databaseHelper from 'src/pkg/helpers/databaseHelper';
import { IResult } from 'src/pkg/interfaces/result';
import { OWNERSHIP_TYPES } from 'src/pkg/constants/ownership';
import { Ownership } from '../domain/ownership';

export default class OwnershipRepository {
  static async CreateOwnership(ownership: Ownership): IResult<Ownership> {
    if (!ownership.type) ownership.type = OWNERSHIP_TYPES.BASE;

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

  static async GetOwnershipByBottleId(bottleId: number): IResult<Ownership> {
    const ownership = await databaseHelper.db().manager.findOne(Ownership, {
      where: { bottleId, type: OWNERSHIP_TYPES.BASE },
    });
    if (!ownership?.id) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }
    return { ok: true, status: StatusCodes.OK, data: ownership };
  }

  static async DeleteOwnershipById(id: number): IResult<null> {
    await databaseHelper.db().manager.delete(Ownership, id);
    return { ok: true, status: StatusCodes.OK, data: null };
  }

  static async GetOwnershipsByAccountId(
    ownerAccountId: string,
    page: number,
    limit: number,
  ): IResult<Ownership[]> {
    const take = limit || 10; // Default limit to 10 if not provided
    const skip = (page - 1) * take;

    const ownerships = await databaseHelper.db().manager.find(Ownership, {
      where: { ownerAccountId, type: OWNERSHIP_TYPES.BASE },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return { ok: true, status: StatusCodes.OK, data: ownerships };
  }
}
