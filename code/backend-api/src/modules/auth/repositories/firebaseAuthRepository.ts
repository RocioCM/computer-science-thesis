import { StatusCodes } from 'http-status-codes';
import firebaseAuthHelper from 'src/pkg/helpers/authHelper';
import { IResult } from 'src/pkg/interfaces/result';

export default class FirebaseAuthRepository {
  static async CreateUser(
    email: string,
    password: string,
  ): IResult<firebaseAuthHelper.auth.UserRecord> {
    const createdUser = await firebaseAuthHelper.auth().createUser({
      email,
      password,
    });
    return { ok: true, status: StatusCodes.CREATED, data: createdUser };
  }

  static async SetUserRole(uid: string, roleId: number): IResult<null> {
    await firebaseAuthHelper.auth().setCustomUserClaims(uid, { role: roleId });
    return { ok: true, status: StatusCodes.OK, data: null };
  }

  static async GetUserWithToken(
    token: string,
  ): IResult<firebaseAuthHelper.auth.UserRecord> {
    try {
      const decodedToken = await firebaseAuthHelper.auth().verifyIdToken(token);
      const user = await firebaseAuthHelper.auth().getUser(decodedToken.uid);
      return { ok: true, status: StatusCodes.OK, data: user };
    } catch (error) {
      return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
    }
  }
}
