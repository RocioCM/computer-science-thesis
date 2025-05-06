import request from 'supertest';
import app from '../src/internal/server';
import { BASE_PATH, ROLES } from '../src/pkg/constants';
import { OWNERSHIP_TYPES } from '../src/pkg/constants/ownership';
import {
  setupTestEnvironment,
  cleanupTestDatabase,
  teardownTestEnvironment,
} from './utils';
import { StatusCodes } from 'http-status-codes';
import blockchainHelper from '../src/pkg/helpers/blockchainHelper';
import AuthHandler from '../src/modules/auth/authHandler';
import OwnershipRepository from '../src/modules/recycler/repositories/ownershipRepository';
import { WasteBottle } from 'src/modules/consumer/domain/wasteBottle';
import ConsumerHandler from 'src/modules/consumer/consumerHandler';
import RecyclerHandler from 'src/modules/recycler/recyclerHandler';

// Mock blockchain helper
jest.mock('../src/pkg/helpers/blockchainHelper', () => ({
  callContractMethod: jest
    .fn()
    .mockImplementation(
      async (_contractAddress, _abi, _methodName, ..._args) => {
        return {
          ok: true,
          status: StatusCodes.OK,
          data: [],
        };
      },
    ),
  callPureContractMethod: jest
    .fn()
    .mockImplementation(async (_contractAddress, _abi, methodName, ...args) => {
      if (methodName === 'recycledMaterials') {
        const batchId = args[0];
        if (batchId === 999) {
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
            id: batchId,
            weight: 500,
            materialType: 'Glass',
            composition:
              '[{"name": "Recycled glass", "amount": 100, "measureUnit": "kg"}]',
            creator: '0x1234567890abcdef',
            buyerOwner:
              batchId === 2
                ? '0xabcdef1234567890'
                : '0x0000000000000000000000000000000000000000',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        };
      } else if (methodName === 'getWasteBottleIdsForBatch') {
        const batchId = args[0];
        if (batchId === 999) {
          return {
            ok: false,
            status: StatusCodes.NOT_FOUND,
            data: null,
          };
        }
        return {
          ok: true,
          status: StatusCodes.OK,
          data: [1, 2, 3],
        };
      } else if (methodName === 'getRecycledMaterialBatchesList') {
        const batchIds = args[0];
        if (!batchIds || batchIds.length === 0) {
          return {
            ok: true,
            status: StatusCodes.OK,
            data: [],
          };
        }
        return {
          ok: true,
          status: StatusCodes.OK,
          data: batchIds.map((id: number) => ({
            id,
            weight: 500,
            materialType: 'Glass',
            composition:
              '[{"name": "Recycled glass", "amount": 100, "measureUnit": "kg"}]',
            creator: '0x1234567890abcdef',
            buyerOwner:
              id === 2
                ? '0xabcdef1234567890'
                : '0x0000000000000000000000000000000000000000',
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
          firebaseUid: 'producer1',
          email: 'producer1@example.com',
          userName: 'Producer One',
          blockchainId: '0xabc123',
        },
        {
          id: 2,
          firebaseUid: 'producer2',
          email: 'producer2@example.com',
          userName: 'Producer Two',
          blockchainId: '0xdef456',
        },
      ],
    };
  }),
}));

// Mock ConsumerHandler
jest.mock('../src/modules/consumer/consumerHandler', () => ({
  GetWasteBottleById: jest.fn().mockImplementation(async (bottleId) => {
    if (bottleId === 999) {
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
        id: bottleId,
        trackingCode: 'track-123',
        owner: '0x1234567890abcdef',
        creator: '0x9876543210fedcba',
        recycledBatchId: bottleId === 2 ? 1 : 0, // Bottle ID 2 is already recycled
        createdAt: new Date().toISOString(),
        deletedAt: '',
      },
    };
  }),
  GetWasteBottleTracking: jest.fn().mockImplementation(async (bottleId) => {
    if (bottleId === 999) {
      return {
        ok: false,
        status: StatusCodes.NOT_FOUND,
        data: null,
      };
    }
    return {
      ok: true,
      status: StatusCodes.OK,
      data: [
        {
          stage: 'recycling',
          data: { someProp: 'value' },
        },
      ],
    };
  }),
  GetWasteBottlesList: jest.fn().mockImplementation(async (bottleIds) => {
    if (!bottleIds || bottleIds.length === 0) {
      return {
        ok: true,
        status: StatusCodes.OK,
        data: [],
      };
    }
    return {
      ok: true,
      status: StatusCodes.OK,
      data: bottleIds.map((id: number) => ({
        id,
        trackingCode: `track-${id}`,
        owner: '0x1234567890abcdef',
        creator: '0x9876543210fedcba',
        recycledBatchId: id === 2 ? 1 : 0, // Bottle ID 2 is already recycled
        createdAt: new Date().toISOString(),
        deletedAt: '',
      })),
    };
  }),
  GetProductOriginByTrackingCode: jest
    .fn()
    .mockImplementation(async (trackingCode) => {
      if (trackingCode === 'invalid-code') {
        return {
          ok: false,
          status: StatusCodes.NOT_FOUND,
          data: null,
        };
      }
      return {
        ok: true,
        status: StatusCodes.OK,
        data: [
          {
            stage: 'base',
            data: {
              id: 1,
              weight: 500,
              materialType: 'Glass',
              composition:
                '[{"name": "Recycled glass", "amount": 100, "measureUnit": "kg"}]',
              creator: '0x1234567890abcdef',
              buyer: '0x9876543210fedcba',
              createdAt: new Date().toISOString(),
            },
          },
          {
            stage: 'product',
            data: {
              id: 2,
              trackingCode,
              owner: '0x1234567890abcdef',
              creator: '0x9876543210fedcba',
              recycledBatchId: 0,
              createdAt: new Date().toISOString(),
            },
          },
        ],
      };
    }),
}));

describe('Recycler API', () => {
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

  // GET /recycler/bottle/origin/:trackingCode
  describe('GET /recycler/bottle/origin/:trackingCode', () => {
    it('should get bottle info by tracking code successfully', async () => {
      const trackingCode = 'track-123';

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/bottle/origin/${trackingCode}`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0]).toHaveProperty('stage', 'base');
      expect(res.body.data[1]).toHaveProperty('stage', 'product');
      expect(res.body.data[1]?.data).toHaveProperty(
        'trackingCode',
        trackingCode,
      );
    });

    it('should return 404 when tracking code is not found', async () => {
      const trackingCode = 'invalid-code';

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/bottle/origin/${trackingCode}`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });
  });

  // GET /recycler/bottle/tracking/:id
  describe('GET /recycler/bottle/tracking/:id', () => {
    it('should get waste bottle tracking info successfully', async () => {
      const spy = jest
        .spyOn(ConsumerHandler, 'GetWasteBottleTracking')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [{ stage: 'recycling', data: { someProp: 'value' } }],
        });
      const bottleId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/bottle/tracking/${bottleId}`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toHaveProperty('stage', 'recycling');
      expect(res.body.data[0].data).toHaveProperty('someProp', 'value');

      spy.mockRestore(); // Restore the original implementation
    });

    it('should return 400 when bottle ID is invalid', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/recycler/bottle/tracking/invalid-id`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid bottle ID');
    });
  });

  // GET /recycler/bottles
  describe('GET /recycler/bottles', () => {
    it('should get all user waste bottles successfully', async () => {
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsByAccountId')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [
            {
              id: 1,
              bottleId: 1,
              ownerAccountId: '0x1234567890abcdef',
              originBatchId: 1,
              type: OWNERSHIP_TYPES.WASTE,
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
            {
              id: 2,
              bottleId: 2,
              ownerAccountId: '0x1234567890abcdef',
              originBatchId: 1,
              type: OWNERSHIP_TYPES.WASTE,
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
            {
              id: 3,
              bottleId: 3,
              ownerAccountId: '0x1234567890abcdef',
              originBatchId: 1,
              type: OWNERSHIP_TYPES.WASTE,
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
          ],
        });

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/bottles?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(3);
      expect(res.body.data[0]).toHaveProperty('id', 1);
      expect(res.body.data[0]).toHaveProperty('trackingCode', 'track-1');

      spy.mockRestore(); // Restore the original implementation
    });

    it('should use default pagination values when not provided', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/recycler/bottles`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should return 401 when user is not authenticated', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/recycler/bottles?page=1&limit=10`)
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
        .get(`${BASE_PATH}/recycler/bottles?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when ownership repository fails', async () => {
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsByAccountId')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        });

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/bottles?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();

      spy.mockRestore(); // Restore the original implementation
    });
  });

  // GET /recycler/bottles/available
  describe('GET /recycler/bottles/available', () => {
    it('should get available waste bottles successfully', async () => {
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsByAccountId')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [
            {
              id: 1,
              bottleId: 1,
              ownerAccountId: '0x1234567890abcdef',
              originBatchId: 1,
              type: OWNERSHIP_TYPES.WASTE,
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
            {
              id: 2,
              bottleId: 2,
              ownerAccountId: '0x1234567890abcdef',
              originBatchId: 1,
              type: OWNERSHIP_TYPES.WASTE,
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
            {
              id: 3,
              bottleId: 3,
              ownerAccountId: '0x1234567890abcdef',
              originBatchId: 1,
              type: OWNERSHIP_TYPES.WASTE,
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
          ],
        });

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/bottles/available?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2); // Should only include bottles with recycledBatchId = 0 (bottles 1 and 3)
      expect(res.body.data[0]).toHaveProperty('recycledBatchId', 0);
      expect(res.body.data.some((bottle: WasteBottle) => bottle.id === 2)).toBe(
        false,
      ); // Should not include bottle 2 which is already recycled

      spy.mockRestore(); // Restore the original implementation
    });

    it('should use default pagination values when not provided', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/recycler/bottles/available`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should return 401 when user is not authenticated', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/recycler/bottles/available?page=1&limit=10`)
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
        .get(`${BASE_PATH}/recycler/bottles/available?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when consumer repository fails', async () => {
      const spy = jest
        .spyOn(ConsumerHandler, 'GetWasteBottlesList')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        });

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/bottles/available?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();

      spy.mockRestore(); // Restore the original implementation
    });

    it('should return 500 when ownership repository fails', async () => {
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsByAccountId')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        });

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/bottles/available?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();

      spy.mockRestore(); // Restore the original implementation
    });
  });

  // GET /recycler/batch/:id
  describe('GET /recycler/batch/:id', () => {
    it('should get recycling batch by ID successfully', async () => {
      const batchId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toHaveProperty('id', batchId);
      expect(res.body.data).toHaveProperty('weight', 500);
      expect(res.body.data).toHaveProperty('materialType', 'Glass');
      expect(blockchainHelper.callPureContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'recycledMaterials',
        batchId,
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const batchId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/batch/${batchId}`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when batch ID is invalid', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/recycler/batch/invalid-id`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });

    it('should return 404 when batch is not found', async () => {
      const batchId = 999; // ID that will trigger not found in the mock

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when waste bottles repository fails', async () => {
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        // Mocking the first call to getRecycledMaterialBatchesList
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            weight: 500,
            materialType: 'Glass',
            composition:
              '[{"name": "Recycled glass", "amount": 100, "measureUnit": "kg"}]',
            creator: '0x1234567890abcdef',
            buyerOwner: '0x0000000000000000000000000000000000000000',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        })
        // Mocking the second call to getWasteBottleIdsForBatch
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.NOT_FOUND,
          data: null,
        });

      const batchId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  // GET /recycler/batches
  describe('GET /recycler/batches', () => {
    it('should get all user recycling batches successfully', async () => {
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsByAccountId')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [
            {
              id: 1,
              bottleId: 1,
              ownerAccountId: '0x1234567890abcdef',
              originBatchId: 1,
              type: OWNERSHIP_TYPES.WASTE,
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
            {
              id: 2,
              bottleId: 2,
              ownerAccountId: '0x1234567890abcdef',
              originBatchId: 1,
              type: OWNERSHIP_TYPES.WASTE,
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
            {
              id: 3,
              bottleId: 3,
              ownerAccountId: '0x1234567890abcdef',
              originBatchId: 1,
              type: OWNERSHIP_TYPES.WASTE,
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
          ],
        });

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/batches?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(3);
      expect(res.body.data[0]).toHaveProperty('id', 1);
      expect(res.body.data[0]).toHaveProperty('materialType', 'Glass');
      expect(OwnershipRepository.GetOwnershipsByAccountId).toHaveBeenCalled();
      expect(blockchainHelper.callPureContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'getRecycledMaterialBatchesList',
        [1, 2, 3],
      );

      spy.mockRestore(); // Restore the original implementation
    });

    it('should return 200 with get zero batches when user has no batches yet', async () => {
      // Just don't mock ownership repository and we will get empty array.

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/batches?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(0);
      expect(blockchainHelper.callPureContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'getRecycledMaterialBatchesList',
        [],
      );
    });

    it('should use default pagination values when not provided', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/recycler/batches`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should return 401 when user is not authenticated', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/recycler/batches?page=1&limit=10`)
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
        .get(`${BASE_PATH}/recycler/batches?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when ownership repository fails', async () => {
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsByAccountId')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        });

      const res = await request(app)
        .get(`${BASE_PATH}/recycler/batches?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();

      spy.mockRestore(); // Restore the original implementation
    });
  });

  // GET /recycler/buyers
  describe('GET /recycler/buyers', () => {
    it('should get filtered buyers successfully', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/recycler/buyers?query=producer`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0]).toHaveProperty('firebaseUid', 'producer1');
      expect(res.body.data[0]).toHaveProperty('email', 'producer1@example.com');
      expect(AuthHandler.GetFilteredUsers).toHaveBeenCalledWith(
        'producer',
        ROLES.PRODUCER,
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/recycler/buyers?query=producer`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when get filtered users fails', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/recycler/buyers?query=error`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  // POST /recycler/batch
  describe('POST /recycler/batch', () => {
    it('should create a recycling batch successfully', async () => {
      // Mock the blockchain call for the successful response
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: [{ name: 'RecycledMaterialBatchCreated', args: [5] }],
      });

      const batchData = {
        weight: 100,
        size: 'Large',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 100, measureUnit: 'kg' }],
        extraInfo: 'Test batch',
        wasteBottleIds: [1, 3],
      };

      const res = await request(app)
        .post(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(batchData)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toHaveProperty('batchId');
      expect(blockchainHelper.callContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'createRecycledMaterialBatch',
        expect.any(Number),
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String),
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const batchData = {
        weight: 100,
        size: 'Large',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 100, measureUnit: 'kg' }],
        extraInfo: 'Test batch',
        wasteBottleIds: [1, 3],
      };

      const res = await request(app)
        .post(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer invalid-token`)
        .send(batchData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not found', async () => {
      const batchData = {
        weight: 100,
        size: 'Large',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 100, measureUnit: 'kg' }],
        extraInfo: 'Test batch',
        wasteBottleIds: [1, 3],
      };

      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.UNAUTHORIZED,
        data: null,
      });

      const res = await request(app)
        .post(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(batchData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when request body is invalid', async () => {
      const invalidData = {
        weight: 'invalid',
        size: 123,
        materialType: 456,
        extraInfo: 789,
        wasteBottleIds: 'not-an-array',
      };

      const res = await request(app)
        .post(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(invalidData)
        .expect(400);

      expect(res.body.status).toBe(400);
    });

    it('should return 500 when blockchain creation fails', async () => {
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      });

      const batchData = {
        weight: 100,
        size: 'Large',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 100, measureUnit: 'kg' }],
        extraInfo: 'Test batch',
        wasteBottleIds: [1, 3],
      };

      const res = await request(app)
        .post(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(batchData)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when adding bottle to batch fails', async () => {
      // First call succeeds (create batch)
      jest
        .spyOn(blockchainHelper, 'callContractMethod')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [{ name: 'RecycledMaterialBatchCreated', args: [5] }],
        })
        // Second call fails (add bottle to batch)
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        });

      const batchData = {
        weight: 100,
        size: 'Large',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 100, measureUnit: 'kg' }],
        extraInfo: 'Test batch',
        wasteBottleIds: [1, 3],
      };

      const res = await request(app)
        .post(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(batchData)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when creating ownership fails', async () => {
      // All blockchain calls succeed
      jest
        .spyOn(blockchainHelper, 'callContractMethod')
        .mockImplementationOnce(async () => ({
          ok: true,
          status: StatusCodes.OK,
          data: [{ name: 'RecycledMaterialBatchCreated', args: [5] }],
        }));

      // But ownership creation fails
      const spy = jest
        .spyOn(OwnershipRepository, 'CreateOwnership')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        });

      const batchData = {
        weight: 100,
        size: 'Large',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 100, measureUnit: 'kg' }],
        extraInfo: 'Test batch',
        wasteBottleIds: [1, 3],
      };

      const res = await request(app)
        .post(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(batchData)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();

      spy.mockRestore();
    });
  });

  // PUT /recycler/batch
  describe('PUT /recycler/batch', () => {
    it('should update a recycling batch successfully', async () => {
      const updateData = {
        id: 1,
        weight: 150,
        size: 'Medium',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 150, measureUnit: 'kg' }],
        extraInfo: 'Updated test batch',
        wasteBottleIds: [1, 4],
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(updateData)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeNull();
      expect(blockchainHelper.callContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'updateRecycledMaterialBatch',
        updateData.id,
        updateData.weight,
        updateData.size,
        updateData.materialType,
        expect.any(String),
        updateData.extraInfo,
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const updateData = {
        id: 1,
        weight: 150,
        size: 'Medium',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 150, measureUnit: 'kg' }],
        extraInfo: 'Updated test batch',
        wasteBottleIds: [1, 3],
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer invalid-token`)
        .send(updateData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not found', async () => {
      const updateData = {
        id: 1,
        weight: 150,
        size: 'Medium',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 150, measureUnit: 'kg' }],
        extraInfo: 'Updated test batch',
        wasteBottleIds: [1, 3],
      };

      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.UNAUTHORIZED,
        data: null,
      });

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(updateData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when request body is invalid', async () => {
      const invalidData = {
        id: 'invalid',
        weight: 'invalid',
        size: 123,
        materialType: 456,
        extraInfo: 789,
        wasteBottleIds: 'not-an-array',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(invalidData)
        .expect(400);

      expect(res.body.status).toBe(400);
    });

    it('should return 404 when batch is not found', async () => {
      const updateData = {
        id: 999, // This will trigger not found in the mock
        weight: 150,
        size: 'Medium',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 150, measureUnit: 'kg' }],
        extraInfo: 'Updated test batch',
        wasteBottleIds: [1, 3],
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(updateData)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not the owner of the batch', async () => {
      // Mock batch with different creator
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            weight: 100,
            size: 'Large',
            materialType: 'Glass',
            composition: '[]',
            creator: '0xDifferentUser',
            buyerOwner: '0x0000000000000000000000000000000000000000',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        });

      const updateData = {
        id: 1,
        weight: 150,
        size: 'Medium',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 150, measureUnit: 'kg' }],
        extraInfo: 'Updated test batch',
        wasteBottleIds: [1, 3],
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(updateData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when updating batch fails', async () => {
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      });

      const updateData = {
        id: 1,
        weight: 150,
        size: 'Medium',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 150, measureUnit: 'kg' }],
        extraInfo: 'Updated test batch',
        wasteBottleIds: [1, 3],
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(updateData)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when getting waste bottles fails', async () => {
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        .mockImplementationOnce(async () => ({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            weight: 100,
            size: 'Large',
            materialType: 'Glass',
            composition: '[]',
            creator: '0x1234567890abcdef',
            buyerOwner: '0x0000000000000000000000000000000000000000',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        }))
        .mockImplementationOnce(async () => ({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        }));

      const updateData = {
        id: 1,
        weight: 150,
        size: 'Medium',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 150, measureUnit: 'kg' }],
        extraInfo: 'Updated test batch',
        wasteBottleIds: [1, 3],
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(updateData)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when removing waste bottles fails', async () => {
      jest
        .spyOn(blockchainHelper, 'callContractMethod')
        // Mocking the first call to updateRecycledMaterialBatch
        .mockImplementationOnce(async () => ({
          ok: true,
          status: StatusCodes.OK,
          data: [],
        }))
        // Mocking the second call to removeWasteBottlesFromBatch
        .mockImplementationOnce(async () => ({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        }));

      const updateData = {
        id: 1,
        weight: 150,
        size: 'Medium',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 150, measureUnit: 'kg' }],
        extraInfo: 'Updated test batch',
        wasteBottleIds: [1, 3],
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(updateData)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when adding waste bottles fails', async () => {
      jest
        .spyOn(blockchainHelper, 'callContractMethod')
        // Mocking the first call to updateRecycledMaterialBatch
        .mockImplementationOnce(async () => ({
          ok: true,
          status: StatusCodes.OK,
          data: [],
        }))
        // Mocking the second call to removeWasteBottlesFromBatch
        .mockImplementationOnce(async () => ({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        }));

      const updateData = {
        id: 1,
        weight: 150,
        size: 'Medium',
        materialType: 'Glass',
        composition: [{ name: 'Glass', amount: 150, measureUnit: 'kg' }],
        extraInfo: 'Updated test batch',
        wasteBottleIds: [1, 2, 3, 4],
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(updateData)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  // PUT /recycler/batch/sell
  describe('PUT /recycler/batch/sell', () => {
    it('should sell a recycling batch successfully', async () => {
      const sellData = {
        batchId: 1,
        buyerUid: 'producer1',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(sellData)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeNull();
      expect(blockchainHelper.callContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'sellRecycledMaterialBatch',
        sellData.batchId,
        expect.any(String),
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const sellData = {
        batchId: 1,
        buyerUid: 'producer1',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch/sell`)
        .set('Authorization', `Bearer invalid-token`)
        .send(sellData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not found', async () => {
      const sellData = {
        batchId: 1,
        buyerUid: 'producer1',
      };

      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.UNAUTHORIZED,
        data: null,
      });

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(sellData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when request body is invalid', async () => {
      const invalidData = {
        batchId: 'invalid',
        buyerUid: 123,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(invalidData)
        .expect(400);

      expect(res.body.status).toBe(400);
    });

    it('should return 404 when batch is not found', async () => {
      const sellData = {
        batchId: 999, // This will trigger not found in the mock
        buyerUid: 'producer1',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(sellData)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not the owner of the batch', async () => {
      // Mock batch with different creator
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            weight: 100,
            size: 'Large',
            materialType: 'Glass',
            composition: '[]',
            creator: '0xDifferentUser',
            buyerOwner: '0x0000000000000000000000000000000000000000',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        });

      const sellData = {
        batchId: 1,
        buyerUid: 'producer1',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(sellData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 404 when buyer is not found', async () => {
      // First call succeeds (authenticating seller)
      jest
        .spyOn(AuthHandler, 'GetUserByFirebaseUid')
        .mockImplementationOnce(async () => ({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            firebaseUid: 'userWithId-userRole-RECYCLER',
            email: 'test@example.com',
            blockchainId: '0x1234567890abcdef',
          },
        }))
        // Second call fails (finding buyer)
        .mockImplementationOnce(async () => ({
          ok: false,
          status: StatusCodes.NOT_FOUND,
          data: null,
        }));

      const sellData = {
        batchId: 1,
        buyerUid: 'non-existent-buyer',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(sellData)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when selling batch fails', async () => {
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      });

      const sellData = {
        batchId: 1,
        buyerUid: 'producer1',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(sellData)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  // PUT /recycler/bottle/assign
  describe('PUT /recycler/bottle/assign', () => {
    it('should assign a waste bottle to a batch successfully', async () => {
      const assignData = {
        batchId: 1,
        bottleId: 1,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/bottle/assign`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(assignData)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeNull();
      expect(blockchainHelper.callContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'addWasteBottleToBatch',
        assignData.batchId,
        assignData.bottleId,
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const assignData = {
        batchId: 1,
        bottleId: 1,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/bottle/assign`)
        .set('Authorization', `Bearer invalid-token`)
        .send(assignData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not found', async () => {
      const assignData = {
        batchId: 1,
        bottleId: 1,
      };

      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.UNAUTHORIZED,
        data: null,
      });

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/bottle/assign`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(assignData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when request body is invalid', async () => {
      const invalidData = {
        batchId: 'invalid',
        bottleId: 'invalid',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/bottle/assign`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(invalidData)
        .expect(400);

      expect(res.body.status).toBe(400);
    });

    it('should return 404 when batch is not found', async () => {
      const assignData = {
        batchId: 999, // This will trigger not found in the mock
        bottleId: 1,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/bottle/assign`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(assignData)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 404 when bottle is not found', async () => {
      const assignData = {
        batchId: 1,
        bottleId: 999, // This will trigger not found in the mock
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/bottle/assign`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(assignData)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not the owner of the batch', async () => {
      // Mock batch with different creator
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            weight: 100,
            size: 'Large',
            materialType: 'Glass',
            composition: '[]',
            creator: '0xDifferentUser',
            buyerOwner: '0x0000000000000000000000000000000000000000',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        });

      const assignData = {
        batchId: 1,
        bottleId: 1,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/bottle/assign`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(assignData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not the owner of the bottle', async () => {
      // Mock waste bottle with different owner
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        .mockImplementationOnce(async () => ({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            weight: 100,
            size: 'Large',
            materialType: 'Glass',
            composition: '[]',
            creator: '0x1234567890abcdef',
            buyerOwner: '0x0000000000000000000000000000000000000000',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        }));

      const originalGetWasteBottleById = jest.requireMock(
        '../src/modules/consumer/consumerHandler',
      ).GetWasteBottleById;
      jest.requireMock(
        '../src/modules/consumer/consumerHandler',
      ).GetWasteBottleById = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: {
          id: 1,
          trackingCode: 'track-123',
          owner: '0xDifferentUser',
          creator: '0x9876543210fedcba',
          recycledBatchId: 0,
          createdAt: new Date().toISOString(),
          deletedAt: '',
        },
      });

      const assignData = {
        batchId: 1,
        bottleId: 1,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/bottle/assign`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(assignData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();

      // Restore original implementation
      jest.requireMock(
        '../src/modules/consumer/consumerHandler',
      ).GetWasteBottleById = originalGetWasteBottleById;
    });

    it('should return 400 when bottle is already assigned to a batch', async () => {
      const assignData = {
        batchId: 1,
        bottleId: 2, // Bottle ID 2 is already recycled in the mock
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/bottle/assign`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(assignData)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBeNull();
    });

    it('should return 409 when batch is already sold', async () => {
      // Mock batch with a buyer
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            weight: 100,
            size: 'Large',
            materialType: 'Glass',
            composition: '[]',
            creator: '0x1234567890abcdef',
            buyerOwner: '0xSomeBuyer', // Batch is already sold
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        });

      const assignData = {
        batchId: 1,
        bottleId: 1,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/bottle/assign`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(assignData)
        .expect(409);

      expect(res.body.status).toBe(409);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when assigning bottle fails', async () => {
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      });

      const assignData = {
        batchId: 1,
        bottleId: 1,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/recycler/bottle/assign`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .send(assignData)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  // DELETE /recycler/batch/:id
  describe('DELETE /recycler/batch/:id', () => {
    it('should delete a recycling batch successfully', async () => {
      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/recycler/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeNull();
      expect(blockchainHelper.callContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'deleteRecycledMaterialBatch',
        batchId,
        expect.any(String),
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/recycler/batch/${batchId}`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not found', async () => {
      const batchId = 1;

      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.UNAUTHORIZED,
        data: null,
      });

      const res = await request(app)
        .delete(`${BASE_PATH}/recycler/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when batch ID is invalid', async () => {
      const res = await request(app)
        .delete(`${BASE_PATH}/recycler/batch/invalid-id`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });

    it('should return 404 when batch is not found', async () => {
      const batchId = 999; // This will trigger not found in the mock

      const res = await request(app)
        .delete(`${BASE_PATH}/recycler/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 401 when user is not the owner of the batch', async () => {
      // Mock batch with different creator
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            weight: 100,
            size: 'Large',
            materialType: 'Glass',
            composition: '[]',
            creator: '0xDifferentUser',
            buyerOwner: '0x0000000000000000000000000000000000000000',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        });

      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/recycler/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when deleting batch fails', async () => {
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      });

      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/recycler/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-RECYCLER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  describe('Recycler Handler', () => {
    it('should get bottles ids for batch', async () => {
      const batchId = 1;
      const expectedBottles = [1, 2, 3];

      // jest.spyOn(blockchainHelper, 'callPureContractMethod').mockResolvedValueOnce({
      //   ok: true,
      //   status: StatusCodes.OK,
      //   data: expectedBottles,
      // });

      const res = await RecyclerHandler.GetBottlesIdsListForBatch(batchId);

      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);
      expect(res.data).toEqual(expectedBottles);
    });

    it('should get user sold batches', async () => {
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsByAccountId')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [],
        });

      const res = await RecyclerHandler.GetAllUserRecyclingBatches(
        'userRole-RECYCLER',
        1,
        10,
        true,
      );

      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);
      expect(res.data?.length).toEqual(0); // No batches returned from the ownership repository mock.
      expect(OwnershipRepository.GetOwnershipsByAccountId).toHaveBeenCalledWith(
        expect.any(String),
        1,
        10,
        OWNERSHIP_TYPES.RECYCLED_SOLD,
      );

      spy.mockRestore();
    });
  });
});
