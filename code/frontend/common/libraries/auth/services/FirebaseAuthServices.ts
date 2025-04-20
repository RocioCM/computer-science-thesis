import {
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  confirmPasswordReset,
  signOut,
  User,
} from 'firebase/auth';
import '@/common/services/firebase';
import { Response } from '@/common/services/request';
import { HTTP_STATUS } from '@/common/constants';
import { UserRole } from '../types';

const googleProvider = new GoogleAuthProvider();

export interface AuthUserInfo {
  token: string;
  user: User;
  role: UserRole;
}

const AuthServices = {
  initAuthStateListener: (
    handleUserLogin: (user: AuthUserInfo) => any,
    handleUserLogout: () => any
  ) => {
    const auth = getAuth();
    const unsubscribeListener = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const user = await AuthServices.getFormattedUser(authUser);
        handleUserLogin(user);
      } else handleUserLogout();
    });

    return unsubscribeListener;
  },

  getFormattedUser: async (authUser: User): Promise<AuthUserInfo> => {
    const tokenResult = await authUser.getIdTokenResult();
    const token = tokenResult.token;
    const user = authUser;
    const role = tokenResult.claims.role as UserRole;

    const formattedUser: AuthUserInfo = { token, user, role };
    return formattedUser;
  },

  refreshUser: async (): Promise<Response<AuthUserInfo>> => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user)
        return { ok: false, data: null, status: HTTP_STATUS.unauthorized };
      const formattedUser = await AuthServices.getFormattedUser(user);
      return { ok: true, data: formattedUser, status: HTTP_STATUS.ok };
    } catch (error) {
      return { ok: false, data: null, status: HTTP_STATUS.internalServerError };
    }
  },

  loginWithGoogle: async (): Promise<Response<AuthUserInfo>> => {
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, googleProvider);
      const formattedUser = await AuthServices.getFormattedUser(result.user);
      return { ok: true, data: formattedUser, status: HTTP_STATUS.ok };
    } catch (error) {
      return { ok: false, data: null, status: HTTP_STATUS.internalServerError };
    }
  },

  loginWithPassword: async (
    email: string,
    password: string
  ): Promise<Response<AuthUserInfo>> => {
    try {
      const auth = getAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);
      const formattedUser = await AuthServices.getFormattedUser(result.user);
      return { ok: true, data: formattedUser, status: HTTP_STATUS.ok };
    } catch (error) {
      return { ok: false, data: null, status: HTTP_STATUS.internalServerError };
    }
  },

  sendRecoverPasswordMail: async (email: string): Promise<Response> => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      return { ok: true, data: null, status: HTTP_STATUS.ok };
    } catch (error) {
      return { ok: false, data: null, status: HTTP_STATUS.internalServerError };
    }
  },

  resetPassword: async (
    code: string,
    newPassword: string
  ): Promise<Response> => {
    try {
      const auth = getAuth();
      await confirmPasswordReset(auth, code, newPassword);
      return { ok: true, data: null, status: HTTP_STATUS.ok };
    } catch (error) {
      return { ok: false, data: null, status: HTTP_STATUS.internalServerError };
    }
  },

  logout: async (): Promise<Response> => {
    try {
      const auth = getAuth();
      await signOut(auth);
      return { ok: true, data: null, status: HTTP_STATUS.ok };
    } catch (error) {
      return { ok: false, data: null, status: HTTP_STATUS.internalServerError };
    }
  },
};

export default AuthServices;
