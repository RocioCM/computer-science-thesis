import { ROLES } from './src/pkg/constants';
import { AppDataSource } from './test/utils';

// Mock firebase authentication module
jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn((idToken) => {
      if (idToken === 'valid-token') {
        return Promise.resolve({ uid: 'new-user-uid' });
      } else if (idToken.startsWith('userWithId')) {
        const userId = idToken.split(/-(.*)/, 2)[1];
        return Promise.resolve({ uid: userId });
      }
      return Promise.reject(new Error('Invalid token'));
    }),
    getUser: jest.fn((uid) => {
      if (uid.startsWith('userRole')) {
        const roleId = ROLES[uid.split(/-(.*)/, 2)[1]];
        if (roleId) {
          return Promise.resolve({
            uid: 'new-user-uid',
            email: 'test@example.com',
            customClaims: { role: roleId },
          });
        }
      }
      if (uid === 'invalid-user') {
        return Promise.reject(new Error('User not found'));
      }
      return Promise.resolve({
        uid: uid,
        email: 'test@example.com',
        customClaims: { role: ROLES.PRODUCER },
      });
    }),

    createUser: jest.fn().mockResolvedValue({ uid: 'new-user-uid' }),
    setCustomUserClaims: jest.fn().mockResolvedValue(undefined),
    deleteUser: jest.fn().mockResolvedValue(undefined),
  }),
}));

// Replace DB Helper connection with the in-memory connection
jest.mock('./src/pkg/helpers/databaseHelper', () => ({
  initializeDBSource: jest.fn(),
  db: jest.fn(() => AppDataSource), // Use the in-memory DB connection
}));
