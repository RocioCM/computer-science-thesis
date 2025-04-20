import { StatusCodes } from 'http-status-codes';
import databaseHelper from 'src/pkg/helpers/databaseHelper';
import { IResult } from 'src/pkg/interfaces/result';
import { Watcher } from '../domain/watcher';

export default class WatcherRepository {
  static async CreateWatcher(watcher: Watcher): IResult<Watcher> {
    const createdWatcher = await databaseHelper
      .db()
      .manager.save(Watcher, watcher);
    if (!createdWatcher?.id) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
    return { ok: true, status: StatusCodes.CREATED, data: createdWatcher };
  }

  static async GetWatchersByUserId(
    userAccountId: string,
    page: number,
    limit: number,
  ): IResult<Watcher[]> {
    const take = limit || 10; // Default limit to 10 if not provided
    const skip = (page - 1) * take;

    const watchers = await databaseHelper.db().manager.find(Watcher, {
      where: { userAccountId },
      skip,
      take,
    });

    return { ok: true, status: StatusCodes.OK, data: watchers };
  }
  static async DeleteWatcher(id: number): IResult<null> {
    const deleteStatus = await databaseHelper.db().manager.delete(Watcher, id);
    if (deleteStatus.affected === 0) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }
    return { ok: true, status: StatusCodes.OK, data: null };
  }

  static async DeleteWatcherByBottleId(bottleId: number): IResult<null> {
    const deleteStatus = await databaseHelper
      .db()
      .manager.delete(Watcher, { wasteBottleId: bottleId });
    if (deleteStatus.affected === 0) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }
    return { ok: true, status: StatusCodes.OK, data: null };
  }
}
