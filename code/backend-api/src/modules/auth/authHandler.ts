import { StatusCodes } from 'http-status-codes';
import { IResult } from 'src/pkg/interfaces/result';
import { CreateUserDTO, UpdateUserDTO, User } from './domain/user';
import FirebaseAuthRepository from './repositories/firebaseAuthRepository';
import UserRepository from './repositories/userRepository';

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

  static async GetUserWithAuth(firebaseUid: string): IResult<User> {
    const userRes = await UserRepository.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    return { ok: true, status: StatusCodes.OK, data: userRes.data };
  }

  static async GetUserByFirebaseUid(firebaseUid: string): IResult<User> {
    return UserRepository.GetUserByFirebaseUid(firebaseUid);
  }

  static async GetUserByBlockchainId(address: string): IResult<User> {
    return UserRepository.GetUserByBlockchainId(address);
  }

  static async UpdateUserWithAuth(
    firebaseUid: string,
    user: UpdateUserDTO,
  ): IResult<null> {
    const userRes = await UserRepository.GetUserByFirebaseUid(firebaseUid);
    if (!userRes.ok) {
      return { ok: false, status: StatusCodes.NOT_FOUND, data: null };
    }

    const updatedUser = { ...userRes.data, ...user };

    return UserRepository.UpdateUser(updatedUser);
  }

  static async GetFilteredUsers(
    searchQuery: string,
    role?: number,
  ): IResult<User[]> {
    const matchedUsersRes = await UserRepository.GetFilteredUsers(searchQuery);
    if (!matchedUsersRes.ok) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }

    let filteredUsers: User[] = [];

    if (role) {
      // If role is provided, filter users by role as well.
      // Loop over the matched users and get the user from Firebase to check the role.
      // We can loop fearlessly here because the number of users in the list will be at most 10.
      for (const user of matchedUsersRes.data) {
        const userRes = await FirebaseAuthRepository.GetUserById(
          user.firebaseUid,
        );
        if (userRes.ok && userRes.data.customClaims?.role === role) {
          filteredUsers.push(user);
        }
      }
    } else {
      filteredUsers = matchedUsersRes.data;
    }

    return { ok: true, status: StatusCodes.OK, data: filteredUsers };
  }
}
