import { StatusCodes } from 'http-status-codes';
import { IResult } from 'src/pkg/interfaces/result';
import { CreateUserDTO, User } from './domain/user';
import FirebaseAuthRepository from './repositories/firebaseAuthRepository';
import UserRepository from './repositories/userRepository';

/// TODO: start with blockchain CRUD and API integration.

export default class AuthHandler {
  static async RegisterUser(user: CreateUserDTO): IResult<User> {
    const {
      ok,
      status,
      data: firebaseUser,
    } = await FirebaseAuthRepository.CreateUser(user.email, user.password);
    if (!ok) {
      return { ok: false, status, data: null };
    }
    await FirebaseAuthRepository.SetUserRole(firebaseUser.uid, user.roleId);
    const { ok: ok2, data: blockchainId } =
      await UserRepository.GetAvailableBlockchainId();
    if (!ok2) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    const userEntity = new User();
    userEntity.firebaseUid = firebaseUser.uid;
    userEntity.email = user.email;
    userEntity.blockchainId = blockchainId;

    return UserRepository.CreateUser(userEntity);
  }

  static async GetUserWithAuth(authToken: string): IResult<User> {
    const firebaseUserRes =
      await FirebaseAuthRepository.GetUserWithToken(authToken);
    if (!firebaseUserRes.ok) {
      return { ok: false, status: firebaseUserRes.status, data: null };
    }

    const userRes = await UserRepository.GetUserByFirebaseUid(
      firebaseUserRes.data.uid,
    );
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    return { ok: true, status: StatusCodes.OK, data: userRes.data };
  }

  static async UpdateUserWithAuth(
    authToken: string,
    user: User,
  ): IResult<null> {
    const firebaseUser =
      await FirebaseAuthRepository.GetUserWithToken(authToken);
    if (!firebaseUser.ok) {
      return { ok: false, status: firebaseUser.status, data: null };
    }

    const userRes = await UserRepository.GetUserByFirebaseUid(
      firebaseUser.data.uid,
    );
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    const prevUser = userRes.data;
    user.id = prevUser.id;
    user.firebaseUid = prevUser.firebaseUid;
    user.email = prevUser.email;
    user.blockchainId = prevUser.blockchainId;

    return UserRepository.UpdateUser(user);
  }
}
