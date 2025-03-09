import AuthServices from '../services/FirebaseAuthServices';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: {
      getIdTokenResult: async () => ({ token: 'fake', claims: { role: 1 } }),
    },
    onAuthStateChanged: async (callback: any) => {
      await callback({
        getIdTokenResult: async () => ({ token: 'fake', claims: { role: 1 } }),
      });
      return () => {};
    },
  }),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  confirmPasswordReset: jest.fn(),
  signOut: jest.fn(),
}));

describe('FirebaseAuthServices', () => {
  beforeEach(() => {
    (getAuth as jest.Mock).mockReturnValue({
      currentUser: {
        getIdTokenResult: async () => ({ token: 'fake', claims: { role: 1 } }),
      },
      onAuthStateChanged: async (callback: any) => {
        await callback({
          getIdTokenResult: async () => ({
            token: 'fake',
            claims: { role: 1 },
          }),
        });
        return () => {};
      },
    });
    jest.clearAllMocks();
  });

  it('initAuthStateListener should return unsubscribe function', async () => {
    const unsubscribe = await AuthServices.initAuthStateListener(
      jest.fn(),
      jest.fn()
    );
    expect(typeof unsubscribe).toBe('function');
  });

  it('initAuthStateListener should call handleUserLogin on auth state change', async () => {
    const handleUserLogin = jest.fn();
    const handleUserLogout = jest.fn();
    await AuthServices.initAuthStateListener(handleUserLogin, handleUserLogout);
    expect(handleUserLogin).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'fake', role: 1 })
    );
    expect(handleUserLogout).toHaveBeenCalledTimes(0);
  });

  it('initAuthStateListener should call handleUserLogout on auth state change', async () => {
    (getAuth as jest.Mock).mockReturnValueOnce({
      currentUser: null,
      onAuthStateChanged: async (callback: any) => {
        await callback(null);
        return () => {};
      },
    });
    const handleUserLogin = jest.fn();
    const handleUserLogout = jest.fn();
    await AuthServices.initAuthStateListener(handleUserLogin, handleUserLogout);
    expect(handleUserLogout).toHaveBeenCalledTimes(1);
    expect(handleUserLogin).toHaveBeenCalledTimes(0);
  });

  it('getFormattedUser should return formatted user', async () => {
    const result = await AuthServices.getFormattedUser({
      getIdTokenResult: () => ({ token: 'fake', claims: { role: 1 } }),
    } as any);
    expect(result.token).toBe('fake');
    expect(result.role).toBe(1);
  });

  it('refreshUser should return formatted user on success', async () => {
    const response = await AuthServices.refreshUser();
    expect(response.ok).toBe(true);
    expect(response.data).toEqual(
      expect.objectContaining({ token: 'fake', role: 1 })
    );
  });

  it('refreshUser should handle missing currentUser', async () => {
    (getAuth as jest.Mock).mockReturnValue({ currentUser: null });
    const response = await AuthServices.refreshUser();
    expect(response.ok).toBe(false);
    expect(response.data).toBe(null);
  });

  it('refreshUser should handle exceptions', async () => {
    (getAuth as jest.Mock).mockImplementationOnce(() => {
      throw new Error('some unexpected error');
    });
    const response = await AuthServices.refreshUser();
    expect(response.ok).toBe(false);
    expect(response.data).toBe(null);
  });

  it('loginWithGoogle should return formatted user on success', async () => {
    (signInWithPopup as jest.Mock).mockResolvedValueOnce({
      user: {
        getIdTokenResult: async () => ({ token: 'fake', claims: { role: 1 } }),
      },
    });
    const response = await AuthServices.loginWithGoogle();
    expect(response.ok).toBe(true);
    expect(response.data).toEqual(
      expect.objectContaining({ token: 'fake', role: 1 })
    );
  });

  it('loginWithGoogle should handle exceptions', async () => {
    (getAuth as jest.Mock).mockImplementationOnce(() => {
      throw new Error('some unexpected error');
    });
    const response = await AuthServices.loginWithGoogle();
    expect(response.ok).toBe(false);
    expect(response.data).toBe(null);
  });

  it('loginWithPassword should return formatted user on success', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: {
        getIdTokenResult: async () => ({ token: 'fake', claims: { role: 1 } }),
      },
    });
    const response = await AuthServices.loginWithPassword(
      'test@test.com',
      'secret'
    );
    expect(response.ok).toBe(true);
    expect(response.data).toEqual(
      expect.objectContaining({ token: 'fake', role: 1 })
    );
  });

  it('loginWithPassword should handle exceptions', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error('some unexpected error')
    );
    const response = await AuthServices.loginWithPassword(
      'test@test.com',
      'secret'
    );
    expect(response.ok).toBe(false);
    expect(response.data).toBe(null);
  });

  it('sendRecoverPasswordMail should handle success', async () => {
    const response = await AuthServices.sendRecoverPasswordMail(
      'test@test.com'
    );
    expect(response.ok).toBe(true);
  });

  it('sendRecoverPasswordMail should handle exceptions', async () => {
    (getAuth as jest.Mock).mockImplementationOnce(() => {
      throw new Error('some unexpected error');
    });
    const response = await AuthServices.sendRecoverPasswordMail(
      'test@test.com'
    );
    expect(response.ok).toBe(false);
  });

  it('resetPassword should handle success', async () => {
    const response = await AuthServices.resetPassword('code', 'newPassword');
    expect(response.ok).toBe(true);
  });

  it('resetPassword should handle exceptions', async () => {
    (getAuth as jest.Mock).mockImplementationOnce(() => {
      throw new Error('some unexpected error');
    });
    const response = await AuthServices.resetPassword('code', 'newPassword');
    expect(response.ok).toBe(false);
  });

  it('logout should handle success', async () => {
    const response = await AuthServices.logout();
    expect(response.ok).toBe(true);
  });

  it('logout should handle exceptions', async () => {
    (getAuth as jest.Mock).mockImplementationOnce(() => {
      throw new Error('some unexpected error');
    });
    const response = await AuthServices.logout();
    expect(response.ok).toBe(false);
  });
});
