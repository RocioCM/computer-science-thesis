import request from 'supertest';
import app from '../src/internal/server';
import { BASE_PATH } from '../src/pkg/constants';
import { OWNERSHIP_TYPES } from '../src/pkg/constants/ownership';
import {
  setupTestEnvironment,
  cleanupTestDatabase,
  teardownTestEnvironment,
} from './utils';
import { StatusCodes } from 'http-status-codes';
import AuthHandler from '../src/modules/auth/authHandler';
import blockchainHelper from '../src/pkg/helpers/blockchainHelper';
import SecondaryProducerHandler from 'src/modules/secondaryProducer/secondaryProducerHandler';
import OwnershipRepository from 'src/modules/secondaryProducer/repositories/ownershipRepository';

// Mock blockchain helper
jest.mock('../src/pkg/helpers/blockchainHelper', () => ({
  callContractMethod: jest
    .fn()
    .mockImplementation(async (_contractAddress, _abi, methodName, ...args) => {
      if (methodName === 'updateTrackingCode') {
        // Special case for failing update
        if (args[0] === 999) {
          return {
            ok: false,
            status: StatusCodes.NOT_FOUND,
            data: null,
          };
        }
        return {
          ok: true,
          status: StatusCodes.OK,
          data: [],
        };
      }

      if (methodName === 'rejectBaseBottles') {
        // Special case for failing reject
        if (args[0] === 999) {
          return {
            ok: false,
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            data: null,
          };
        }
        return {
          ok: true,
          status: StatusCodes.OK,
          data: [],
        };
      }

      if (methodName === 'recycleProductBottles') {
        // Special case for failing recycle
        if (args[0] === 999) {
          return {
            ok: false,
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            data: null,
          };
        }
        return {
          ok: true,
          status: StatusCodes.OK,
          data: [],
        };
      }

      if (methodName === 'sellProductBottle') {
        // Special case for failing sell
        if (args[0] === 999) {
          return {
            ok: false,
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            data: null,
          };
        }
        return {
          ok: true,
          status: StatusCodes.OK,
          data: [{ name: 'ProductBottlesSold', args: [0, 2] }],
        };
      }

      if (methodName === 'deleteTrackingCode') {
        // Special case for failing delete
        if (args[0] === 999) {
          return {
            ok: false,
            status: StatusCodes.NOT_FOUND,
            data: null,
          };
        }
        return {
          ok: true,
          status: StatusCodes.OK,
          data: [],
        };
      }

      return {
        ok: true,
        status: StatusCodes.OK,
        data: [],
      };
    }),
  callPureContractMethod: jest
    .fn()
    .mockImplementation(async (contractAddress, abi, methodName, ...args) => {
      if (
        methodName === 'productBottles' ||
        methodName === 'getProductBottleByCode'
      ) {
        const id = args[0];
        if (id === 999) {
          return {
            ok: false,
            status: StatusCodes.NOT_FOUND,
            data: null,
          };
        }
        return {
          ok: true,
          status: StatusCodes.OK,
          data: {
            id,
            quantity: 100,
            availableQuantity: 80,
            originBaseBatchId: 1,
            trackingCode: 'track-123',
            owner: '0x1234567890abcdef',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        };
      } else if (methodName === 'getProductBottlesList') {
        const ids = args[0];
        return {
          ok: true,
          status: StatusCodes.OK,
          data: ids.map((id: number) => ({
            id,
            quantity: 100,
            availableQuantity: 80,
            originBaseBatchId: 1,
            trackingCode: `track-${id}`,
            owner: '0x1234567890abcdef',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          })),
        };
      }
      return {
        ok: false,
        status: StatusCodes.NOT_FOUND,
        data: null,
      };
    }),
}));

// Mock AuthHandler
jest.mock('../src/modules/auth/authHandler', () => ({
  GetUserByFirebaseUid: jest.fn().mockImplementation(async (uid) => {
    if (uid === 'invalid-uid') {
      return {
        ok: false,
        status: StatusCodes.NOT_FOUND,
        data: null,
      };
    }
    return {
      ok: true,
      status: StatusCodes.OK,
      data: {
        id: 1,
        firebaseUid: uid,
        email: 'test@example.com',
        blockchainId: '0x1234567890abcdef',
      },
    };
  }),
  GetFilteredUsers: jest.fn().mockImplementation(async (query, role) => {
    if (query === 'error') {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
    return {
      ok: true,
      status: StatusCodes.OK,
      data: [
        {
          id: 1,
          firebaseUid: 'buyer1',
          email: 'buyer1@example.com',
          userName: 'Buyer One',
          blockchainId: '0xabc123',
        },
        {
          id: 2,
          firebaseUid: 'buyer2',
          email: 'buyer2@example.com',
          userName: 'Buyer Two',
          blockchainId: '0xdef456',
        },
      ],
    };
  }),
}));

// Mock ProducerHandler
jest.mock('../src/modules/producer/producerHandler', () => ({
  GetBatchById: jest.fn().mockImplementation(async (id) => {
    if (id === 999) {
      return {
        ok: false,
        status: StatusCodes.NOT_FOUND,
        data: null,
      };
    }
    return {
      ok: true,
      status: StatusCodes.OK,
      data: {
        id,
        quantity: 200,
        bottleType: {
          weight: 500,
          color: 'green',
          thickness: 2,
          shapeType: 'round',
          originLocation: 'Argentina',
          extraInfo: 'Recycled glass',
          composition: [],
        },
        owner: '0x1234567890abcdef',
        createdAt: new Date().toISOString(),
        deletedAt: '',
      },
    };
  }),
}));

// Mock RecyclerHandler
jest.mock('../src/modules/recycler/recyclerHandler', () => ({
  GetRecyclingBatchById: jest.fn(),
  GetAllUserRecyclingBatches: jest.fn(),
}));

describe('Secondary Producer API', () => {
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

  // GET /secondary-producer/batch/:id
  describe('GET /secondary-producer/batch/:id', () => {
    it('should get a batch by ID successfully', async () => {
      const batchId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toHaveProperty('id', batchId);
      expect(res.body.data).toHaveProperty('quantity', 100);
      expect(res.body.data).toHaveProperty('trackingCode', 'track-123');
      expect(blockchainHelper.callPureContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'productBottles',
        batchId,
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const batchId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/batch/${batchId}`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when batch ID is invalid', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/batch/invalid-id`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });

    it('should return 404 when batch is not found', async () => {
      const batchId = 999; // ID that will trigger not found in the mock

      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });
  });

  // GET /secondary-producer/batch/base/:id
  describe('GET /secondary-producer/batch/base/:id', () => {
    it('should get a base batch by ID successfully', async () => {
      const batchId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/batch/base/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toHaveProperty('id', batchId);
      expect(res.body.data).toHaveProperty('quantity', 200);
      expect(res.body.data.bottleType).toHaveProperty('color', 'green');
    });

    it('should return 401 when user is not authenticated', async () => {
      const batchId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/batch/base/${batchId}`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when batch ID is invalid', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/batch/base/invalid-id`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });

    it('should return 404 when base batch is not found', async () => {
      const batchId = 999; // ID that will trigger not found in the mock

      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/batch/base/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });
  });

  // GET /secondary-producer/batches/user
  describe('GET /secondary-producer/batches/user', () => {
    it('should get all batches for authenticated user successfully', async () => {
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsByAccountId')
        .mockImplementationOnce(async (accountId, page, limit) => {
          return {
            ok: true,
            status: StatusCodes.OK,
            data: [
              {
                id: 1,
                bottleId: 1,
                originBatchId: 1,
                type: '',
                ownerAccountId: accountId,
                createdAt: '',
                deletedAt: '',
              },
              {
                id: 2,
                bottleId: 2,
                originBatchId: 1,
                type: '',
                ownerAccountId: accountId,
                createdAt: '',
                deletedAt: '',
              },
            ],
          };
        });
      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/batches/user?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0]).toHaveProperty('id', 1);
      expect(res.body.data[1]).toHaveProperty('id', 2);
      expect(blockchainHelper.callPureContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'getProductBottlesList',
        [1, 2],
      );

      spy.mockRestore();
    });

    it('should use default pagination values when not provided', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/batches/user`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should return 401 when user is not authenticated', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/batches/user?page=1&limit=10`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not found', async () => {
      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.UNAUTHORIZED,
        data: null,
      });

      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/batches/user?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when ownership repository fails', async () => {
      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: {
          id: 1,
          firebaseUid: 'test-user',
          email: 'test@example.com',
          blockchainId: 'error', // This will trigger an error in the ownership repository mock
        },
      });

      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsByAccountId')
        .mockImplementationOnce(async (accountId, _page, _limit) => {
          if (accountId === 'error') {
            return {
              ok: false,
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              data: null,
            };
          }
          return {
            ok: true,
            status: StatusCodes.OK,
            data: [],
          };
        });

      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/batches/user?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();

      spy.mockRestore();
    });
  });

  // GET /secondary-producer/buyers
  describe('GET /secondary-producer/buyers', () => {
    it('should get filtered buyers successfully', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/buyers?query=buyer`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0]).toHaveProperty('firebaseUid', 'buyer1');
      expect(res.body.data[0]).toHaveProperty('email', 'buyer1@example.com');
    });

    it('should return 401 when user is not authenticated', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/buyers?query=buyer`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when get filtered users fails', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/secondary-producer/buyers?query=error`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  // PUT /secondary-producer/batch/code
  describe('PUT /secondary-producer/batch/code', () => {
    it('should update product batch tracking code successfully', async () => {
      const updateData = {
        id: 1,
        trackingCode: 'new-tracking-code',
      };
      const uppercaseTrackingCode = updateData.trackingCode
        .toUpperCase()
        .trim();

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/code`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(updateData)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeNull();
      expect(blockchainHelper.callContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'updateTrackingCode',
        updateData.id,
        uppercaseTrackingCode,
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const updateData = {
        id: 1,
        trackingCode: 'new-tracking-code',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/code`)
        .set('Authorization', `Bearer invalid-token`)
        .send(updateData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when request body is invalid', async () => {
      const invalidData = {
        id: 'invalid',
        trackingCode: 123,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/code`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(invalidData)
        .expect(400);

      expect(res.body.status).toBe(400);
    });

    it('should return 404 when batch is not found', async () => {
      const updateData = {
        id: 999, // This will trigger not found in the mock
        trackingCode: 'new-tracking-code',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/code`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(updateData)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not found', async () => {
      const updateData = {
        id: 1,
        trackingCode: 'new-tracking-code',
      };

      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.UNAUTHORIZED,
        data: null,
      });

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/code`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(updateData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not the owner of the batch', async () => {
      // Mock user with different blockchain id
      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: {
          id: 1,
          firebaseUid: 'test-user',
          email: 'test@example.com',
          blockchainId: '0xdifferent',
        },
      });

      const updateData = {
        id: 1,
        trackingCode: 'new-tracking-code',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/code`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(updateData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 409 when tracking code is already in use', async () => {
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: 'Tracking code already in use',
      });

      const updateData = {
        id: 1,
        trackingCode: 'track-123', // This will trigger conflict in the mock
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/code`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(updateData)
        .expect(409);

      expect(res.body.status).toBe(409);
      expect(res.body.data).toBeNull();
    });
  });

  // PUT /secondary-producer/batch/reject/:id
  describe('PUT /secondary-producer/batch/reject/:id', () => {
    it('should reject base bottles batch successfully', async () => {
      const batchId = 1;

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/reject/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeNull();
      expect(blockchainHelper.callContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'rejectBaseBottles',
        batchId,
      );
    });

    it('should delete ownership when rejecting batch successfully', async () => {
      const spy1 = jest
        .spyOn(OwnershipRepository, 'GetOwnershipByBottleId')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            bottleId: 1,
            originBatchId: 1,
            type: OWNERSHIP_TYPES.PRODUCT,
            ownerAccountId: '0x1234567890abcdef',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        });
      const spy2 = jest.spyOn(OwnershipRepository, 'DeleteOwnershipById');

      const batchId = 1;

      await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/reject/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(200);

      expect(OwnershipRepository.DeleteOwnershipById).toHaveBeenCalledWith(
        batchId,
      );

      spy1.mockRestore();
      spy2.mockRestore();
    });

    it('should return 401 when user is not authenticated', async () => {
      const batchId = 1;

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/reject/${batchId}`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when batch ID is invalid', async () => {
      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/reject/invalid-id`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });

    it('should return 401 when user is not found', async () => {
      const batchId = 1;

      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.UNAUTHORIZED,
        data: null,
      });

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/reject/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 404 when batch is not found', async () => {
      const batchId = 999; // This will trigger not found in the mock

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/reject/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not the owner of the batch', async () => {
      // Mock user with different blockchain id
      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: {
          id: 1,
          firebaseUid: 'test-user',
          email: 'test@example.com',
          blockchainId: '0xdifferent',
        },
      });

      const batchId = 1;

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/reject/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when rejecting batch fails', async () => {
      // Override the mock to fail the blockchain call
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      });

      const batchId = 1;

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/reject/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  // PUT /secondary-producer/batch/recycle
  describe('PUT /secondary-producer/batch/recycle', () => {
    it('should recycle base bottles successfully', async () => {
      // Mock blockchain helper function for selling bottles
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: [{ name: 'ProductBottlesRecycled', args: [0, 1] }],
      });

      const recycleData = {
        productBatchId: 1,
        quantity: 50,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/recycle`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(recycleData)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data.recyclingBatchId).toBe(1);
      expect(blockchainHelper.callContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'recycleProductBottles',
        recycleData.productBatchId,
        recycleData.quantity,
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const recycleData = {
        productBatchId: 1,
        quantity: 50,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/recycle`)
        .set('Authorization', `Bearer invalid-token`)
        .send(recycleData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when request body is invalid', async () => {
      const invalidData = {
        productBatchId: 'invalid',
        quantity: 'invalid',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/recycle`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(invalidData)
        .expect(400);

      expect(res.body.status).toBe(400);
    });

    it('should return 401 when user is not found', async () => {
      const recycleData = {
        productBatchId: 1,
        quantity: 50,
      };

      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.UNAUTHORIZED,
        data: null,
      });

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/recycle`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(recycleData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 404 when batch is not found', async () => {
      const recycleData = {
        productBatchId: 999, // This will trigger not found in the mock
        quantity: 50,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/recycle`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(recycleData)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not the owner of the batch', async () => {
      // Mock user with different blockchain id
      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: {
          id: 1,
          firebaseUid: 'test-user',
          email: 'test@example.com',
          blockchainId: '0xdifferent',
        },
      });

      const recycleData = {
        productBatchId: 1,
        quantity: 50,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/recycle`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(recycleData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });
  });

  // PUT /secondary-producer/batch/sell
  describe('PUT /secondary-producer/batch/sell', () => {
    it('should sell product bottles successfully', async () => {
      const sellData = {
        batchId: 1,
        quantity: 50,
        buyerUid: 'buyer1',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(sellData)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toHaveProperty('soldProductId', 2);
      expect(blockchainHelper.callContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'sellProductBottle',
        expect.any(Number),
        expect.any(Number),
        expect.any(String),
        expect.any(String),
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const sellData = {
        batchId: 1,
        quantity: 50,
        buyerUid: 'buyer1',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/sell`)
        .set('Authorization', `Bearer invalid-token`)
        .send(sellData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when request body is invalid', async () => {
      const invalidData = {
        batchId: 'invalid',
        quantity: 'invalid',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(invalidData)
        .expect(400);

      expect(res.body.status).toBe(400);
    });

    it('should return 401 when user is not found', async () => {
      const sellData = {
        batchId: 1,
        quantity: 50,
        buyerUid: 'buyer1',
      };

      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.UNAUTHORIZED,
        data: null,
      });

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(sellData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 404 when batch is not found', async () => {
      const sellData = {
        batchId: 999, // This will trigger not found in the mock
        quantity: 50,
        buyerUid: 'buyer1',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(sellData)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not the owner of the batch', async () => {
      // Mock user with different blockchain id
      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: {
          id: 1,
          firebaseUid: 'test-user',
          email: 'test@example.com',
          blockchainId: '0xdifferent',
        },
      });

      const sellData = {
        batchId: 1,
        quantity: 50,
        buyerUid: 'buyer1',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(sellData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when buyer is not found', async () => {
      // First call returns the seller, second call returns not found for the buyer
      jest
        .spyOn(AuthHandler, 'GetUserByFirebaseUid')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            firebaseUid: 'test-user',
            email: 'test@example.com',
            blockchainId: '0x1234567890abcdef',
          },
        })
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.NOT_FOUND,
          data: null,
        });

      const sellData = {
        batchId: 1,
        quantity: 50,
        buyerUid: 'non-existent-buyer',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(sellData)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when selling product fails', async () => {
      const sellData = {
        batchId: 999, // This will trigger error in the mock
        quantity: 50,
        buyerUid: 'buyer1',
      };

      // Override the mock to first return the batch
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 999,
            quantity: 100,
            availableQuantity: 80,
            originBaseBatchId: 1,
            trackingCode: 'track-123',
            owner: '0x1234567890abcdef',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        });

      const res = await request(app)
        .put(`${BASE_PATH}/secondary-producer/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .send(sellData)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  // DELETE /secondary-producer/batch/code/:id
  describe('DELETE /secondary-producer/batch/code/:id', () => {
    it('should delete product batch tracking code successfully', async () => {
      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/secondary-producer/batch/code/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeNull();
      expect(blockchainHelper.callContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'deleteTrackingCode',
        batchId,
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/secondary-producer/batch/code/${batchId}`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when batch ID is invalid', async () => {
      const res = await request(app)
        .delete(`${BASE_PATH}/secondary-producer/batch/code/invalid-id`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });

    it('should return 401 when user is not found', async () => {
      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.UNAUTHORIZED,
        data: null,
      });

      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/secondary-producer/batch/code/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 404 when batch is not found', async () => {
      const batchId = 999; // This will trigger not found in the mock

      const res = await request(app)
        .delete(`${BASE_PATH}/secondary-producer/batch/code/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not the owner of the batch', async () => {
      // Mock user with different blockchain id
      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: {
          id: 1,
          firebaseUid: 'test-user',
          email: 'test@example.com',
          blockchainId: '0xdifferent',
        },
      });

      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/secondary-producer/batch/code/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-SECONDARY_PRODUCER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });
  });

  describe('SecondaryProducerHandler', () => {
    it('should get product batch by tracking code', async () => {
      const trackingCode = 'track-123';
      const res =
        await SecondaryProducerHandler.GetBatchByTrackingCode(trackingCode);

      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('trackingCode', trackingCode);
    });
  });
});
