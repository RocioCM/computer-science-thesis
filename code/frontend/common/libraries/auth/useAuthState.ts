import { useReducer, useEffect } from 'react';
import { useRouter } from 'next/router';
import { reducer, initialState } from './reducer';
import AuthServices, { AuthUserInfo } from './services/FirebaseAuthServices';
import UserServices from './services/UserServices';
import { User, LoginPayload, ActionTypes, UserRole } from './types';
import { updateSession } from './session';

/**
 * Returns state and methods related to user auth.
 * @WARN ONLY USE this hook in a CONTEXT PROVIDER.
 * Otherwise you won't be able to share this state between screens or components.
 */
const useAuthState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  /** Joins the Auth User Info object with the User Data object from the API
   * to a friendlier structure to save in the context. */
  const formatUser = async (authUser: AuthUserInfo) => {
    const { ok, data: apiUser } = await UserServices.getUserData();
    if (!ok) return { ok: false, data: null };

    const user: User = {
      role: authUser.role,
      sessionToken: authUser.token,
      ...apiUser,
    };
    return { ok: true, data: user };
  };

  /**
   * Receives Auth User Info and saves it in the context
   *  including the User Data from the API.
   * @param authData - Auth User Info object.
   * @returns ok is true if the user was saved successfully.
   */
  const loadUserInContext = async (authData: AuthUserInfo) => {
    updateSession(authData.token);
    const { ok, data: user } = await formatUser(authData);
    if (ok && user) {
      dispatch({ type: ActionTypes.LOGIN, value: user });
      return { ok: true, data: user };
    }
    return { ok: false, data: null };
  };

  /** Refreshes user information using the available sessionToken.
   * @returns ok is true if the user data was refreshed in the context successfully.
   */
  const refreshUser = async () => {
    const { ok, data } = await AuthServices.refreshUser();
    if (ok) return loadUserInContext(data);
    return { ok: false, data: null };
  };

  /**
   * Updates user data in the API and refreshes the user in the context.
   * @param user - User object with the new data.
   * @returns ok is true if the user was updated successfully.
   */
  const updateUserData = async (newUser: User) => {
    const { ok } = await UserServices.updateUser(newUser);
    if (ok) refreshUser();
    return { ok };
  };

  /**
   * Triggers the Google login popup and saves the user in the context if successful.
   * @returns ok is true if the user was saved successfully.
   */
  const loginWithGoogle = async () => {
    const { ok, data } = await AuthServices.loginWithGoogle();
    if (ok) {
      return loadUserInContext(data);
    }
    return { ok: false, data: null };
  };

  /**
   * Logs in the user with email and password and saves it in the context if successful.
   * @param form - Object containing email and password.
   * @returns ok is true if the user was authenticated and saved successfully.
   */
  const loginWithPassword = async (form: LoginPayload) => {
    const { ok, data } = await AuthServices.loginWithPassword(
      form.email,
      form.password
    );
    if (ok) {
      return loadUserInContext(data);
    }
    return { ok: false, data: null };
  };

  /**
   * Logs out the user (invalidates current session) and removes it from the context.
   * @param triggerReload - If true, it will reload the page after logout.
   * @returns ok is true if the user was logged out successfully.
   */
  const logout = async (triggerReload = false) => {
    await AuthServices.logout();
    dispatch({ type: ActionTypes.LOGOUT });
    if (triggerReload) router.reload();
  };

  /** Returns true if current user has the provided role.
   * If no user is provided, it uses the current user in the state.
   * If no user is in the state, it returns false.
   */
  const userHasRole = (
    role: UserRole,
    validationUser: User | null = null
  ): boolean => {
    const user = validationUser || state.user;
    if (!user) return false;
    return user.role === role;
  };

  useEffect(() => {
    return AuthServices.initAuthStateListener(loadUserInContext, logout);
  }, []);

  // Re-export stateless Methods
  const resetPassword = AuthServices.resetPassword;
  const sendRecoverPasswordMail = AuthServices.sendRecoverPasswordMail;

  const actions = {
    userHasRole,
    refreshUser,
    loginWithGoogle,
    loginWithPassword,
    updateUserData,
    logout,
    resetPassword,
    sendRecoverPasswordMail,
  };

  return { ...state, ...actions };
};

useAuthState.defaultReturn = (): ReturnType<typeof useAuthState> => ({
  loading: true,
  isLoggedIn: false,
  user: null,
  refreshUser: async () => ({ ok: false, data: null }),
  loginWithGoogle: async () => ({ ok: false, data: null }),
  loginWithPassword: async () => ({ ok: false, data: null }),
  logout: async () => {},
  userHasRole: () => false,
  updateUserData: async () => ({ ok: false }),
  resetPassword: async () => ({ ok: false, data: null, status: 0 }),
  sendRecoverPasswordMail: async () => ({ ok: false, data: null, status: 0 }),
});

export default useAuthState;
