import request from 'supertest';
import app from '../src/internal/server';
import { BASE_PATH, ROLES } from '../src/pkg/constants';
import {
  setupTestEnvironment,
  cleanupTestDatabase,
  teardownTestEnvironment,
  AppDataSource,
} from './utils';

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
jest.mock('../src/pkg/helpers/databaseHelper', () => ({
  initializeDBSource: jest.fn(),
  db: jest.fn(() => AppDataSource),
}));

describe('Auth API', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  it('should register a new user', async () => {
    const newUser = {
      email: 'test@example.com',
      password: 'password123',
      roleId: ROLES.PRODUCER,
    };

    const res = await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(newUser)
      .expect(201);
    expect(res.body.status).toBe(201);
    expect(res.body.data).toHaveProperty('firebaseUid');
    expect(res.body.data.id).toBe(1);
    expect(res.body.data.blockchainId).toMatch(/^0x/); // Start with 0x
    expect(res.body.data.email).toBe(newUser.email);
  });

  it('should not register a new user with invalid email', async () => {
    const newUser = {
      email: 'invalid-email',
      password: 'password',
      roleId: 'invalid-type',
    };

    const res = await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(newUser)
      .expect(400);

    expect(res.body.status).toBe(400);
  });

  it('should get a user with authentication', async () => {
    const loginUser = {
      email: 'test@example.com',
      password: 'password123',
      roleId: ROLES.PRODUCER,
    };

    // First, register the user
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(loginUser)
      .expect(201);

    // Use the token to get the authenticated user
    const res = await request(app)
      .get(BASE_PATH + '/auth/user')
      .set('Authorization', 'Bearer userWithId-new-user-uid')
      .expect(200);
    expect(res.body.status).toBe(200);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toBe(loginUser.email);
  });

  it('should not get a user with invalid authentication', async () => {
    const res = await request(app)
      .get(BASE_PATH + '/auth/user')
      .set('Authorization', 'Bearer')
      .expect(401);

    expect(res.body.status).toBe(401);
    expect(res.body.data).toBeNull();
  });

  it('should not get an unexisting user', async () => {
    const res = await request(app)
      .get(BASE_PATH + '/auth/user')
      .set('Authorization', 'Bearer userWithId-none-user')
      .expect(404);

    expect(res.body.status).toBe(404);
  });

  it('should update a user with authentication', async () => {
    const loginUser = {
      email: 'test@example.com',
      password: 'password123',
      roleId: ROLES.PRODUCER,
    };

    // First, register the user
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(loginUser)
      .expect(201);

    // Use the token to get the base user
    let res = await request(app)
      .get(BASE_PATH + '/auth/user')
      .set('Authorization', 'Bearer userWithId-new-user-uid')
      .expect(200);
    expect(res.body.data.userName).toBe('');
    expect(res.body.data.managerName).toBe('');
    expect(res.body.data.phone).toBe('');

    // Update the user
    const updatedUser = {
      userName: 'Productor ABC',
      managerName: 'Juan Perez',
      phone: '+123456',
    };

    res = await request(app)
      .put(BASE_PATH + '/auth/user')
      .set('Authorization', 'Bearer userWithId-new-user-uid')
      .send(updatedUser)
      .expect(200);

    // Use the token to get the updated user
    res = await request(app)
      .get(BASE_PATH + '/auth/user')
      .set('Authorization', 'Bearer userWithId-new-user-uid')
      .expect(200);
    expect(res.body.status).toBe(200);
    expect(res.body.data.email).toBe(loginUser.email);
    expect(res.body.data.userName).toBe(updatedUser.userName);
    expect(res.body.data.managerName).toBe(updatedUser.managerName);
    expect(res.body.data.phone).toBe(updatedUser.phone);
  });

  it('should not update a user with invalid authentication', async () => {
    const updatedUser = {
      userName: 'Productor ABC',
      managerName: 'Juan Perez',
      phone: '+123456',
    };

    const res = await request(app)
      .put(BASE_PATH + '/auth/user')
      .set('Authorization', 'Bearer invalid-token')
      .send(updatedUser)
      .expect(401);

    expect(res.body.status).toBe(401);
    expect(res.body.data).toBeNull();
  });

  it('should not update a user with invalid data', async () => {
    const updatedUser = {
      userName: 123,
      managerName: 'Juan Perez',
      phone: 'invalid-phone',
    };

    const res = await request(app)
      .put(BASE_PATH + '/auth/user')
      .set('Authorization', 'Bearer valid-token')
      .send(updatedUser)
      .expect(400);

    expect(res.body.status).toBe(400);
    expect(res.body.data).not.toBeFalsy();
  });

  it('should not update unexistent user', async () => {
    const updatedUser = {
      userName: 'Productor ABC',
      managerName: 'Juan Perez',
      phone: '+123456',
    };

    const res = await request(app)
      .put(BASE_PATH + '/auth/user')
      .set('Authorization', 'Bearer userWithId-none-user')
      .send(updatedUser)
      .expect(404);

    expect(res.body.status).toBe(404);
    expect(res.body.data).toBeNull();
  });
});
