import { StatusCodes } from 'http-status-codes';
import { AuthUser } from 'src/pkg/helpers/authHelper';
import firebaseAuthHelper from 'firebase-admin';
import { IResult } from 'src/pkg/interfaces/result';

export default class FirebaseAuthRepository {
  static async CreateUser(email: string, password: string): IResult<AuthUser> {
    try {
      const createdUser = await firebaseAuthHelper.auth().createUser({
        email,
        password,
      });
      return { ok: true, status: StatusCodes.CREATED, data: createdUser };
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        return {
          ok: false,
          status: StatusCodes.CONFLICT,
          data: error.message,
        };
      }
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  static async SetUserRole(uid: string, roleId: number): IResult<null> {
    await firebaseAuthHelper.auth().setCustomUserClaims(uid, { role: roleId });
    return { ok: true, status: StatusCodes.OK, data: null };
  }

  static async GetUserById(uid: string): IResult<AuthUser> {
    try {
      const user = await firebaseAuthHelper.auth().getUser(uid);
      return { ok: true, status: StatusCodes.OK, data: user };
    } catch (error: any) {
      return {
        ok: false,
        status: StatusCodes.NOT_FOUND,
        data: error.message,
      };
    }
  }
}
