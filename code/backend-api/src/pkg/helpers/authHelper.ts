import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as firebaseAdmin from 'firebase-admin';
import { getEnv } from './env';
import { IResult } from 'src/pkg/interfaces/result';
import requestHelper from './requestHelper';

export type RoleType = number;
export type AuthUser = firebaseAdmin.auth.UserRecord;

export function initializeAdmin(): Promise<void> {
  try {
    const serviceAccount = JSON.parse(getEnv('FIREBASE_CONFIG', '{}'));

    // Init Firebase Authentication Admin
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
    });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Authenticate user with Firebase token and check if user has the required role.
 * @param req Request object from Express
 * @param roles (Optional) List of roles that are allowed to access the resource or route.
 * If not provided, any authenticated user can access the resource.
 * @returns User record if authenticated and has the required role, otherwise Unauthorized or Forbidden
 */
export async function Authenticate(
  req: Request,
  roles: RoleType[] = [],
): IResult<AuthUser> {
  const authToken = requestHelper.getAuthToken(req);

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(authToken);
    const user = await firebaseAdmin.auth().getUser(decodedToken.uid);

    // Check if user has the required role
    const claims = user.customClaims;
    if (
      roles.length &&
      (!claims || !claims.role || !roles.includes(claims.role))
    ) {
      return { ok: false, status: StatusCodes.FORBIDDEN, data: null };
    }

    return { ok: true, status: StatusCodes.OK, data: user };
  } catch (error) {
    return { ok: false, status: StatusCodes.UNAUTHORIZED, data: null };
  }
}

export default firebaseAdmin;
