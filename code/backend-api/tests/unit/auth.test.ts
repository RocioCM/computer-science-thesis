import request from 'supertest';
import app from 'src/internal/server';
import { BASE_PATH, ROLES } from 'src/pkg/constants';
import {
  setupTestEnvironment,
  cleanupTestDatabase,
  teardownTestEnvironment,
} from '../utils';
import FirebaseAuthRepository from 'src/modules/auth/repositories/firebaseAuthRepository';
import UserRepository from 'src/modules/auth/repositories/userRepository';
import AuthHandler from 'src/modules/auth/authHandler';

describe('Auth API', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  describe('POST /auth/register', () => {
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

    it('should not register duplicated email user', async () => {
      const spy = jest
        .spyOn(FirebaseAuthRepository, 'CreateUser')
        .mockResolvedValueOnce({
          ok: false,
          status: 409,
          data: 'auth/email-already-exists',
        });

      const newUser = {
        email: 'test@example.com',
        password: 'password123',
        roleId: ROLES.PRODUCER,
      };

      const res = await request(app)
        .post(BASE_PATH + '/auth/register')
        .send(newUser)
        .expect(409);

      expect(res.body.status).toBe(409);
      expect(res.body.data).toBeNull();

      spy.mockRestore();
    });

    it('should not register user if not blockchain id available', async () => {
      const spy = jest
        .spyOn(UserRepository, 'GetAvailableBlockchainId')
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          data: null,
        });

      const newUser = {
        email: 'test@example.com',
        password: 'password123',
        roleId: ROLES.PRODUCER,
      };

      const res = await request(app)
        .post(BASE_PATH + '/auth/register')
        .send(newUser)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();

      spy.mockRestore();
    });
  });

  describe('GET /auth/user', () => {
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
        .set('Authorization', 'Bearer userWithId-test')
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
  });

  describe('PUT /auth/user', () => {
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
        .set('Authorization', 'Bearer userWithId-test')
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
        .set('Authorization', 'Bearer userWithId-test')
        .send(updatedUser)
        .expect(200);

      // Use the token to get the updated user
      res = await request(app)
        .get(BASE_PATH + '/auth/user')
        .set('Authorization', 'Bearer userWithId-test')
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

  describe('Auth Handler', () => {
    it('should get user by firebase uid', async () => {
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

      // Use the created user uid to get the authenticated user
      const uid = 'test';
      const result = await AuthHandler.GetUserByFirebaseUid(uid);

      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('firebaseUid', uid);
      expect(result.data).toHaveProperty('email', loginUser.email);
    });

    it('should get user by blockchain id', async () => {
      const loginUser = {
        email: 'test@example.com',
        password: 'password123',
        roleId: ROLES.PRODUCER,
      };

      // First, register the user
      const res = await request(app)
        .post(BASE_PATH + '/auth/register')
        .send(loginUser)
        .expect(201);

      expect(res.body.status).toBe(201);
      expect(res.body.data).toHaveProperty('blockchainId');

      // Use the created user uid to get the authenticated user
      const blockchainId = res.body.data.blockchainId;
      const result = await AuthHandler.GetUserByBlockchainId(blockchainId);

      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('blockchainId', blockchainId);
      expect(result.data).toHaveProperty('email', loginUser.email);
    });

    it('should not get user by unexistent blockchain id', async () => {
      const result = await AuthHandler.GetUserByBlockchainId('unexistent-id');

      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
      expect(result.data).toBeNull();
    });

    it('should filter users by query', async () => {
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

      const result = await AuthHandler.GetFilteredUsers('test');

      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0]).toHaveProperty('email', loginUser.email);

      const result2 = await AuthHandler.GetFilteredUsers('nonexistent');
      expect(result2.ok).toBe(true);
      expect(result2.status).toBe(200);
      expect(result2.data).toHaveLength(0);
    });

    it('should not filter users if repository errors', async () => {
      const spy = jest
        .spyOn(UserRepository, 'GetFilteredUsers')
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          data: null,
        });

      const result = await AuthHandler.GetFilteredUsers('test');

      expect(result.ok).toBe(false);
      expect(result.status).toBe(500);
      expect(result.data).toBeNull();

      spy.mockRestore();
    });

    it('should filter users by role', async () => {
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

      const result = await AuthHandler.GetFilteredUsers('test', ROLES.PRODUCER);

      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0]).toHaveProperty('email', loginUser.email);

      const result2 = await AuthHandler.GetFilteredUsers(
        'test',
        ROLES.SECONDARY_PRODUCER,
      );
      expect(result2.ok).toBe(true);
      expect(result2.status).toBe(200);
      expect(result2.data).toHaveLength(0);
    });
  });
});
