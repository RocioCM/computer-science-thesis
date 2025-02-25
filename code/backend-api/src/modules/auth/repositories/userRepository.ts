import * as crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import databaseHelper from 'src/pkg/helpers/databaseHelper';
import { IResult } from 'src/pkg/interfaces/result';
import { User } from '../domain/user';

export default class UserRepository {
  static async CreateUser(user: User): IResult<User> {
    const createdUser = await databaseHelper.db().manager.save(User, user);
    if (!createdUser?.id) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
    return { ok: true, status: StatusCodes.CREATED, data: createdUser };
  }

  static async GetUserByFirebaseUid(firebaseUid: string): IResult<User> {
    const user = await databaseHelper
      .db()
      .manager.findOne(User, { where: { firebaseUid } });
    if (!user?.id) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }
    return { ok: true, status: StatusCodes.OK, data: user };
  }

  static async GetAvailableBlockchainId(): IResult<string> {
    let addressInUse = true;
    let randomAddress = '';

    while (addressInUse) {
      // Create a random 40-hex-character string. Ethereum addresses are 40-hex-character strings (20 bytes = 40 hex characters).
      randomAddress = '0x' + crypto.randomBytes(20).toString('hex');
      const userWithAddress = await databaseHelper.db().manager.findOne(User, {
        where: { blockchainId: randomAddress },
      });
      if (!userWithAddress?.id) {
        addressInUse = false;
      }
    }
    return { ok: true, status: StatusCodes.OK, data: randomAddress };
  }

  static async UpdateUser(user: User): IResult<null> {
    const updatedStatus = await databaseHelper
      .db()
      .manager.update(User, user.id, user);
    if (updatedStatus.affected === 0) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }
    return { ok: true, status: StatusCodes.OK, data: null };
  }
}
