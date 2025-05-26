import { ROLES } from './src/pkg/constants';
import { AppDataSource } from './tests/utils';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock firebase authentication module
jest.mock('firebase-admin', () => ({
  credential: { cert: jest.fn() },
  initializeApp: jest.fn(),

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
    getUser: jest.fn((uid: string) => {
      if (uid.startsWith('userRole')) {
        const [, role, ...userId] = uid.split(/-/);
        const roleId = ROLES[role as keyof typeof ROLES];
        if (roleId) {
          return Promise.resolve({
            uid: userId.join('-') || 'new-user-uid',
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

    createUser: jest.fn(({ email }: { email: string }) => ({
      uid: email.split('@')[0] || 'new-user-uid',
    })),
    setCustomUserClaims: jest.fn().mockResolvedValue(undefined),
    deleteUser: jest.fn().mockResolvedValue(undefined),
  }),
}));

// Replace DB Helper connection with the in-memory connection
jest.mock('./src/pkg/helpers/databaseHelper', () => ({
  initializeDBSource: jest.fn(),
  db: jest.fn(() => AppDataSource), // Use the in-memory DB connection
}));
