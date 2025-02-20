import { StatusCodes } from 'http-status-codes';
import databaseHelper from 'src/pkg/helpers/databaseHelper';
import { IResult } from 'src/pkg/interfaces/result';
import { Ownership } from '../domain/ownership';
import { OWNERSHIP_TYPES } from 'src/pkg/constants/ownership';

export default class OwnershipRepository {
  static async CreateOwnership(ownership: Ownership): IResult<Ownership> {
    if (!ownership.type) ownership.type = OWNERSHIP_TYPES.PRODUCT;

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

  static async GetAllOwnerships(): IResult<Ownership[]> {
    const ownerships = await databaseHelper
      .db()
      .manager.find(Ownership, { where: { type: OWNERSHIP_TYPES.PRODUCT } });
    return { ok: true, status: StatusCodes.OK, data: ownerships };
  }

  static async GetOwnershipByBottleId(bottleId: number): IResult<Ownership> {
    const ownership = await databaseHelper.db().manager.findOne(Ownership, {
      where: { bottleId, type: OWNERSHIP_TYPES.PRODUCT },
    });
    if (!ownership?.id) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }
    return { ok: true, status: StatusCodes.OK, data: ownership };
  }

  static async GetOwnershipsByAccountId(
    ownerAccountId: string,
    page: number,
    limit: number,
  ): IResult<Ownership[]> {
    const take = limit || 10; // Default limit to 10 if not provided
    const skip = (page - 1) * take;

    const ownerships = await databaseHelper.db().manager.find(Ownership, {
      where: { ownerAccountId, type: OWNERSHIP_TYPES.PRODUCT },
      skip,
      take,
    });

    return { ok: true, status: StatusCodes.OK, data: ownerships };
  }
}
