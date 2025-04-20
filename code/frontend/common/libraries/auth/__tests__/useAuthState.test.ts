import { act, renderHook } from '@testing-library/react';
import useAuthState from '../useAuthState';
import AuthServices from '../services/FirebaseAuthServices';
import UserServices from '../services/UserServices';

const reloadMockFn = jest.fn();
jest.mock('../services/FirebaseAuthServices');
jest.mock('../services/UserServices');
jest.mock('next/router', () => ({
  useRouter: () => ({
    reload: reloadMockFn,
  }),
}));

describe('useAuthState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuthState());
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.isLoggedIn).toBe(false);
  });

  it('hook should have default return for context', async () => {
    const result = useAuthState.defaultReturn();
    expect(result.loading).toBe(true);
    expect(result.isLoggedIn).toBe(false);
    expect(result.user).toBe(null);
    expect(result.registerUser).toBeDefined();
    expect(await result.registerUser({} as any)).toEqual({
      ok: false,
      data: null,
      status: 0,
    });
    expect(result.refreshUser).toBeDefined();
    expect(await result.refreshUser()).toEqual({ ok: false, data: null });
    expect(result.loginWithGoogle).toBeDefined();
    expect(await result.loginWithGoogle()).toEqual({ ok: false, data: null });
    expect(result.loginWithPassword).toBeDefined();
    expect(await result.loginWithPassword({} as any)).toEqual({
      ok: false,
      data: null,
    });
    expect(result.logout).toBeDefined();
    expect(await result.logout()).toBeUndefined();
    expect(result.userHasRole).toBeDefined();
    expect(await result.userHasRole(1)).toBe(false);
    expect(result.updateUserData).toBeDefined();
    expect(await result.updateUserData({} as any)).toEqual({ ok: false });
    expect(result.resetPassword).toBeDefined();
    expect(await result.resetPassword('', '')).toEqual({
      ok: false,
      data: null,
      status: 0,
    });
    expect(result.sendRecoverPasswordMail).toBeDefined();
    expect(await result.sendRecoverPasswordMail('')).toEqual({
      ok: false,
      data: null,
      status: 0,
    });
  });

  it('should register user', async () => {
    const user = { id: 1, email: 'test@test.com' };
    (UserServices.registerUser as jest.Mock).mockResolvedValue({
      ok: true,
      data: user,
    });
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      const res = await result.current.registerUser({
        email: 'test@test.com',
        password: 'secret',
        roleId: 1,
      });

      expect(res).toEqual({ ok: true, data: user });
    });

    // user should register but not log in.
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should not register user if registerUser fails', async () => {
    (UserServices.registerUser as jest.Mock).mockResolvedValue({
      ok: false,
      data: null,
    });
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      const res = await result.current.registerUser({
        email: 'test@test.com',
        password: 'secret',
        roleId: 1,
      });
      expect(res).toEqual({ ok: false, data: null });
    });
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('loginWithPassword should call loadUserInContext', async () => {
    (AuthServices.loginWithPassword as jest.Mock).mockResolvedValue({
      ok: true,
      data: { token: '123', role: 1 },
    });
    (UserServices.getUserData as jest.Mock).mockResolvedValue({
      ok: true,
      data: { email: '' },
    });
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      await result.current.loginWithPassword({
        email: 'test@test.com',
        password: 'secret',
      });
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toEqual({
      email: '',
      sessionToken: '123',
      role: 1,
    });
  });

  it('loginWithPassword should not login if loginWithPassword fails', async () => {
    (AuthServices.loginWithPassword as jest.Mock).mockResolvedValue({
      ok: false,
      data: null,
    });
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      await result.current.loginWithPassword({
        email: 'test@test.com',
        password: 'secret',
      });
    });
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('loginWithGoogle should call loadUserInContext', async () => {
    (AuthServices.loginWithGoogle as jest.Mock).mockResolvedValue({
      ok: true,
      data: { token: '123', role: 1 },
    });
    (UserServices.getUserData as jest.Mock).mockResolvedValue({
      ok: true,
      data: { email: 'example@mail.com' },
    });
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      await result.current.loginWithGoogle();
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toEqual({
      email: 'example@mail.com',
      sessionToken: '123',
      role: 1,
    });
  });

  it('should not login if loginWithGoogle fails', async () => {
    (AuthServices.loginWithGoogle as jest.Mock).mockResolvedValue({
      ok: false,
      data: null,
    });
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      await result.current.loginWithGoogle();
    });
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should refresh user from cached token', async () => {
    (AuthServices.refreshUser as jest.Mock).mockResolvedValue({
      ok: true,
      data: { token: '123', role: 1 },
    });
    (UserServices.getUserData as jest.Mock).mockResolvedValue({
      ok: true,
      data: { email: 'example@mail.com' },
    });
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      await result.current.refreshUser();
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toEqual({
      email: 'example@mail.com',
      sessionToken: '123',
      role: 1,
    });
  });

  it('refreshUser should not login if refreshUser fails', async () => {
    (AuthServices.refreshUser as jest.Mock).mockResolvedValue({
      ok: false,
      data: null,
    });
    (UserServices.getUserData as jest.Mock).mockResolvedValue({
      ok: true,
      data: { email: 'test@test.com' },
    });
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      await result.current.refreshUser();
    });
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('refreshUser should not login if getUserData fails', async () => {
    (AuthServices.refreshUser as jest.Mock).mockResolvedValue({
      ok: true,
      data: { token: '123', role: 1 },
    });
    (UserServices.getUserData as jest.Mock).mockResolvedValue({
      ok: false,
      data: null,
    });
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      await result.current.refreshUser();
    });
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should update user data', async () => {
    (UserServices.updateUser as jest.Mock).mockResolvedValue({ ok: true });
    (AuthServices.refreshUser as jest.Mock).mockResolvedValue({
      ok: true,
      data: { token: '123', role: 1 },
    });
    (UserServices.getUserData as jest.Mock).mockResolvedValue({
      ok: true,
      data: { email: 'update@test.com' },
    });
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      await result.current.updateUserData({ email: 'update@test.com' } as any);
    });
    expect(result.current.user).toEqual({
      email: 'update@test.com',
      sessionToken: '123',
      role: 1,
    });
  });

  it('should not update user data if updateUserData fails', async () => {
    (UserServices.updateUser as jest.Mock).mockResolvedValue({ ok: false });
    (AuthServices.refreshUser as jest.Mock).mockResolvedValue({
      ok: true,
      data: { token: '123', role: 1 },
    });
    (UserServices.getUserData as jest.Mock).mockResolvedValue({
      ok: true,
      data: { email: 'update@test.com' },
    });
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      await result.current.updateUserData({ email: 'update@test.com' } as any);
    });
    expect(result.current.user?.email).not.toEqual({
      email: 'update@test.com',
    });
  });

  it('logout should dispatch logout action', async () => {
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      await result.current.logout();
    });
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBe(null);
    expect(AuthServices.logout).toHaveBeenCalled();
    expect(reloadMockFn).not.toHaveBeenCalled();
  });

  it('logout should reload page', async () => {
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      await result.current.logout(true);
    });
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBe(null);
    expect(reloadMockFn).toHaveBeenCalled();
  });

  it('userHasRole should return false if not logged in', () => {
    const { result } = renderHook(() => useAuthState());
    expect(result.current.userHasRole(1)).toBe(false);
  });

  it('userHasRole should return false if provided user does not have allowed role', () => {
    const { result } = renderHook(() => useAuthState());
    expect(result.current.userHasRole(1, { role: 2 } as any)).toBe(false);
  });

  it('userHasRole should return true if provided user has allowed role', () => {
    const { result } = renderHook(() => useAuthState());
    expect(result.current.userHasRole(1, { role: 1 } as any)).toBe(true);
  });

  it('userHasRole should return true if current user has allowed role', async () => {
    (AuthServices.refreshUser as jest.Mock).mockResolvedValue({
      ok: true,
      data: { token: '123', role: 1 },
    });
    (UserServices.getUserData as jest.Mock).mockResolvedValue({
      ok: true,
      data: { email: 'example@mail.com' },
    });
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      await result.current.refreshUser();
    });
    expect(result.current.userHasRole(1)).toBe(true);
  });

  it('userHasRole should return false if current user does not have allowed role', async () => {
    (AuthServices.refreshUser as jest.Mock).mockResolvedValue({
      ok: true,
      data: { token: '123', role: 1 },
    });
    (UserServices.getUserData as jest.Mock).mockResolvedValue({
      ok: true,
      data: { email: 'example@mail.com' },
    });
    const { result } = renderHook(() => useAuthState());
    await act(async () => {
      await result.current.refreshUser();
    });
    expect(result.current.userHasRole(2)).toBe(false);
  });
});
