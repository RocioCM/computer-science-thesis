import request from 'supertest';
import {
  AppDataSource,
  cleanupTestDatabase,
  setupTestEnvironment,
  teardownTestEnvironment,
} from './utils';
import app from '../src/internal/server';
import { BASE_PATH, ROLES } from '../src/pkg/constants';
import { StatusCodes } from 'http-status-codes';
import blockchainHelper from '../src/pkg/helpers/blockchainHelper';

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

describe('Producer API', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  it('should create a new base bottles batch', async () => {
    const newUser = {
      email: 'test@example.com',
      password: 'password123',
      roleId: ROLES.PRODUCER,
    };

    let res = await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(newUser)
      .expect(201);

    // Mock blockchain helper function for creating a new batch.
    jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValue({
      ok: true,
      status: StatusCodes.OK,
      data: [{ name: 'BaseBatchCreated', args: [1] }],
    });

    const newBatch = {
      quantity: 100,
      bottleType: {
        weight: 500,
        color: 'green',
        thickness: 2,
        shapeType: 'round',
        originLocation: 'Argentina',
        extraInfo: 'Recycled glass',
        composition: [{ name: 'Glass', amount: 100, measureUnit: 'kg' }],
      },
      createdAt: new Date().toISOString(),
    };

    res = await request(app)
      .post(BASE_PATH + '/producer/batch')
      .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
      .send(newBatch)
      .expect(201);

    expect(res.body.status).toBe(201);
    expect(res.body.data.batchId).toBe(1);
  });

  xit('should get a batch by ID', async () => {
    const batchId = 1;
    const res = await request(app)
      .get(`/producer/batch/${batchId}`)
      .expect(200);
    expect(res.body).toHaveProperty('id', batchId);
  });

  xit('should get all batches by user', async () => {
    const res = await request(app)
      .get('/producer/batches/user?page=1&limit=10')
      .expect(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  xit('should update a base bottles batch', async () => {
    const updatedBatch = {
      id: 1,
      quantity: 150,
      bottleType: {
        weight: 500,
        color: 'blue',
        thickness: 2,
        shapeType: 'round',
        originLocation: 'Argentina',
        extraInfo: 'Recycled glass',
        composition: [{ name: 'Glass', amount: 150, measureUnit: 'kg' }],
      },
      createdAt: new Date().toISOString(),
    };

    const res = await request(app)
      .put('/producer/batch')
      .send(updatedBatch)
      .expect(200);
    expect(res.body).toBeNull();
  });

  xit('should delete a base bottles batch', async () => {
    const batchId = 1;
    const res = await request(app)
      .delete(`/producer/batch/${batchId}`)
      .expect(200);
    expect(res.body).toBeNull();
  });

  xit('should sell base bottles', async () => {
    const sellData = {
      batchId: 1,
      quantity: 50,
      buyerUid: 'buyer-uid',
    };

    const res = await request(app)
      .put('/producer/batch/sell')
      .send(sellData)
      .expect(200);
    expect(res.body).toHaveProperty('productBatchId');
  });

  xit('should recycle base bottles batch', async () => {
    const recycleData = {
      batchId: 1,
      quantity: 50,
    };

    const res = await request(app)
      .put('/producer/batch/recycle')
      .send(recycleData)
      .expect(200);
    expect(res.body).toBeNull();
  });
});
