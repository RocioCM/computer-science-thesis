import { StatusCodes } from 'http-status-codes';
import databaseHelper from 'src/pkg/helpers/databaseHelper';
import { IResult } from 'src/pkg/interfaces/result';
import { Ownership } from '../domain/ownership';

export default class OwnershipRepository {
  static async GetOwnershipsWithFilters(
    ownershipFilters: Partial<Ownership>,
    page: number,
    limit: number,
  ): IResult<Ownership[]> {
    const take = limit || 10; // Default limit to 10 if not provided
    const skip = (page - 1) * take;

    const ownerships = await databaseHelper.db().manager.find(Ownership, {
      where: { ...ownershipFilters },
      skip,
      take,
    });

    return { ok: true, status: StatusCodes.OK, data: ownerships };
  }
}
