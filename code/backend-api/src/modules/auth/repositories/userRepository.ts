import * as crypto from 'crypto';
import databaseHelper from 'src/pkg/helpers/databaseHelper';
import { User } from '../domain/user';
import { IResult } from 'src/pkg/interfaces/result';
import { StatusCodes } from 'http-status-codes';

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

  static async GetAllUsers(): IResult<User[]> {
    const users = await databaseHelper.db().manager.find(User);
    return { ok: true, status: StatusCodes.OK, data: users };
  }

  static async GetUserById(id: number): IResult<User> {
    const user = await databaseHelper
      .db()
      .manager.findOne(User, { where: { id } });
    if (!user?.id) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }
    return { ok: true, status: StatusCodes.OK, data: user };
  }

  static async GetUserByEmail(email: string): IResult<User> {
    const user = await databaseHelper
      .db()
      .manager.findOne(User, { where: { email } });
    if (!user?.id) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }
    return { ok: true, status: StatusCodes.OK, data: user };
  }

  static async GetUserByBlockchainId(blockchainId: string): IResult<User> {
    const user = await databaseHelper.db().manager.findOne(User, {
      where: { blockchainId },
    });
    if (!user?.id) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }
    return { ok: true, status: StatusCodes.OK, data: user };
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
      randomAddress = '0x' + crypto.randomBytes(16).toString('hex'); // Create a random 32-hex-character string. 16 bytes = 32 hex characters
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
