import request from 'supertest';
import app from 'src/internal/server';
import { BASE_PATH, ROLES } from 'src/pkg/constants';
import {
  setupTestEnvironment,
  cleanupTestDatabase,
  teardownTestEnvironment,
} from '../utils';
import { StatusCodes } from 'http-status-codes';
import blockchainHelper from 'src/pkg/helpers/blockchainHelper';
import AuthHandler from 'src/modules/auth/authHandler';
import RecyclerHandler from 'src/modules/recycler/recyclerHandler';
import SecondaryProducerHandler from 'src/modules/secondaryProducer/secondaryProducerHandler';
import WatcherRepository from 'src/modules/consumer/repositories/watcherRepository';
import OwnershipRepository from 'src/modules/consumer/repositories/ownershipRepository';
import ConsumerHandler from 'src/modules/consumer/consumerHandler';

// Mock blockchain helper
jest.mock('src/pkg/helpers/blockchainHelper', () => ({
  callContractMethod: jest
    .fn()
    .mockImplementation(async (contractAddress, abi, methodName, ...args) => {
      if (methodName === 'createWasteBottle') {
        if (args[0] === 'invalid-code') {
          return {
            ok: false,
            status: StatusCodes.BAD_REQUEST,
            data: null,
          };
        }
        return {
          ok: true,
          status: StatusCodes.OK,
          data: [{ name: 'WasteBottleCreated', args: [1] }],
        };
      }

      if (methodName === 'deleteWasteBottle') {
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
      if (methodName === 'wasteBottles') {
        const bottleId = args[0];
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
            creator: '0x1234567890abcdef',
            recycledBatchId: bottleId === 2 ? 1 : 0,
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        };
      } else if (methodName === 'getWasteBottlesList') {
        const bottleIds = args[0];
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
            creator: '0x1234567890abcdef',
            recycledBatchId: 0,
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
jest.mock('src/modules/auth/authHandler', () => ({
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
  GetUserByBlockchainId: jest.fn().mockImplementation(async (blockchainId) => {
    if (blockchainId === 'invalid-address') {
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
        firebaseUid: 'test-user',
        email: 'test@example.com',
        userName: 'Test User',
        blockchainId,
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
          firebaseUid: 'recycler1',
          email: 'recycler1@example.com',
          userName: 'Recycler One',
          blockchainId: '0xabc123',
        },
        {
          id: 2,
          firebaseUid: 'recycler2',
          email: 'recycler2@example.com',
          userName: 'Recycler Two',
          blockchainId: '0xdef456',
        },
      ],
    };
  }),
}));

// Mock SecondaryProducerHandler
jest.mock('src/modules/secondaryProducer/secondaryProducerHandler', () => ({
  GetBatchByTrackingCode: jest.fn().mockImplementation(async (trackingCode) => {
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
      data: {
        id: 1,
        quantity: 100,
        availableQuantity: 80,
        originBaseBatchId: 1,
        trackingCode,
        owner: '0x1234567890abcdef',
        createdAt: new Date().toISOString(),
        deletedAt: '',
      },
    };
  }),
  GetBaseBatchById: jest.fn().mockImplementation(async (id) => {
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
jest.mock('src/modules/recycler/recyclerHandler', () => ({
  GetRecyclingBatchById: jest.fn().mockImplementation(async (id) => {
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
        weight: 500,
        materialType: 'Glass',
        composition: 'Recycled material',
        creator: '0x1234567890abcdef',
      },
    };
  }),
}));

describe('Consumer API', () => {
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

  // GET /consumer/origin/:trackingCode
  describe('GET /consumer/origin/:trackingCode', () => {
    it('should get product origin by tracking code successfully', async () => {
      const trackingCode = 'track-123';

      const res = await request(app)
        .get(`${BASE_PATH}/consumer/origin/${trackingCode}`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].stage).toBe('base');
      expect(res.body.data[1].stage).toBe('product');
      expect(
        SecondaryProducerHandler.GetBatchByTrackingCode,
      ).toHaveBeenCalledWith(trackingCode);
      expect(SecondaryProducerHandler.GetBaseBatchById).toHaveBeenCalled();
    });

    it("should handle failure in getting owner's information successfully", async () => {
      const trackingCode = 'track-123';

      // First call returns the primary producer, second call returns secondary producer.
      // Both fail to get user information and should fall back to empty string.
      jest
        .spyOn(AuthHandler, 'GetUserByBlockchainId')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.NOT_FOUND,
          data: null,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.NOT_FOUND,
          data: null,
        });

      const res = await request(app)
        .get(`${BASE_PATH}/consumer/origin/${trackingCode}`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].stage).toBe('base');
      expect(res.body.data[0].data.ownerName).toBe('');
      expect(res.body.data[1].stage).toBe('product');
      expect(res.body.data[1].data.ownerName).toBe('');
      expect(
        SecondaryProducerHandler.GetBatchByTrackingCode,
      ).toHaveBeenCalledWith(trackingCode);
      expect(SecondaryProducerHandler.GetBaseBatchById).toHaveBeenCalled();
    });

    it("should handle empty data when getting owner's information successfully", async () => {
      const trackingCode = 'track-123';

      // First call returns the primary producer, second call returns secondary producer.
      // Both don't include username and should fall back to empty string.
      jest
        .spyOn(AuthHandler, 'GetUserByBlockchainId')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            firebaseUid: 'test-user',
            email: 'test@example.com',
            blockchainId: '0x1234567890abcdef',
            userName: undefined,
          },
        })
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            firebaseUid: 'test-user',
            email: 'test@example.com',
            blockchainId: '0x1234567890abcdef',
            userName: undefined,
          },
        });

      const res = await request(app)
        .get(`${BASE_PATH}/consumer/origin/${trackingCode}`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].stage).toBe('base');
      expect(res.body.data[0].data.ownerName).toBe('');
      expect(res.body.data[1].stage).toBe('product');
      expect(res.body.data[1].data.ownerName).toBe('');
      expect(
        SecondaryProducerHandler.GetBatchByTrackingCode,
      ).toHaveBeenCalledWith(trackingCode);
      expect(SecondaryProducerHandler.GetBaseBatchById).toHaveBeenCalled();
    });

    it('should return 404 when tracking code is not found', async () => {
      const trackingCode = 'invalid-code';

      const res = await request(app)
        .get(`${BASE_PATH}/consumer/origin/${trackingCode}`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
      expect(
        SecondaryProducerHandler.GetBatchByTrackingCode,
      ).toHaveBeenCalledWith(trackingCode);
    });

    it('should return 404 when tracking code is valid but not sold yet', async () => {
      // Override GetBatchByTrackingCode for this test
      jest
        .spyOn(SecondaryProducerHandler, 'GetBatchByTrackingCode')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            quantity: 100,
            availableQuantity: 100, // Not sold yet
            originBaseBatchId: 1,
            trackingCode: 'track-123',
            owner: '0x1234567890abcdef',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        });

      const trackingCode = 'track-123';

      const res = await request(app)
        .get(`${BASE_PATH}/consumer/origin/${trackingCode}`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 404 when base batch is not sold yet', async () => {
      // Override GetBaseBatchById for this test
      jest
        .spyOn(SecondaryProducerHandler, 'GetBaseBatchById')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            quantity: 100,
            soldQuantity: 0, // Not sold yet
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
        });

      const trackingCode = 'track-123';

      const res = await request(app)
        .get(`${BASE_PATH}/consumer/origin/${trackingCode}`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when base batch retrieval fails', async () => {
      // Override the mock for this test
      jest
        .spyOn(SecondaryProducerHandler, 'GetBaseBatchById')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        });

      const trackingCode = 'track-123';

      const res = await request(app)
        .get(`${BASE_PATH}/consumer/origin/${trackingCode}`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  // GET /consumer/waste
  describe('GET /consumer/waste', () => {
    it('should get all user waste bottles successfully', async () => {
      const spy = jest
        .spyOn(WatcherRepository, 'GetWatchersByUserId')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [
            {
              id: 1,
              wasteBottleId: 1,
              userAccountId: '0x1234567890abcdef',
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
            {
              id: 2,
              wasteBottleId: 2,
              userAccountId: '0x1234567890abcdef',
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
          ],
        });
      const res = await request(app)
        .get(`${BASE_PATH}/consumer/waste?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0]).toHaveProperty('id', 1);
      expect(res.body.data[0]).toHaveProperty('trackingCode', 'track-1');
      expect(WatcherRepository.GetWatchersByUserId).toHaveBeenCalled();
      expect(blockchainHelper.callPureContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'getWasteBottlesList',
        [1, 2],
      );

      spy.mockRestore(); // Restore the original implementation
    });

    it('should use default pagination values when not provided', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/consumer/waste`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should return 401 when user is not authenticated', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/consumer/waste?page=1&limit=10`)
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
        .get(`${BASE_PATH}/consumer/waste?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when watcher repository fails', async () => {
      const spy = jest
        .spyOn(WatcherRepository, 'GetWatchersByUserId')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        });

      const res = await request(app)
        .get(`${BASE_PATH}/consumer/waste?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  // GET /consumer/waste/:id
  describe('GET /consumer/waste/:id', () => {
    it('should get waste bottle tracking successfully for non-recycled bottle', async () => {
      const bottleId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/consumer/waste/${bottleId}`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].stage).toBe('pickup');
      expect(blockchainHelper.callPureContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'wasteBottles',
        bottleId,
      );
    });

    it('should get waste bottle tracking successfully for recycled bottle', async () => {
      const bottleId = 2; // This ID has recycledBatchId set to 1 in our mock

      const res = await request(app)
        .get(`${BASE_PATH}/consumer/waste/${bottleId}`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].stage).toBe('pickup');
      expect(res.body.data[1].stage).toBe('recycling');
      expect(RecyclerHandler.GetRecyclingBatchById).toHaveBeenCalled();
    });

    it('should return 401 when user is not authenticated', async () => {
      const bottleId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/consumer/waste/${bottleId}`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when bottle ID is invalid', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/consumer/waste/invalid-id`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid bottle ID');
    });

    it('should return 404 when bottle is not found', async () => {
      const bottleId = 999; // This ID will trigger not found in our mock

      const res = await request(app)
        .get(`${BASE_PATH}/consumer/waste/${bottleId}`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should handle recycling batch not found', async () => {
      // Override the GetWasteBottleById mock for this test
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 3,
            trackingCode: 'track-3',
            owner: '0x1234567890abcdef',
            creator: '0x1234567890abcdef',
            recycledBatchId: 999, // This will trigger not found for recycling batch
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        });

      const bottleId = 3;

      const res = await request(app)
        .get(`${BASE_PATH}/consumer/waste/${bottleId}`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(1); // Only pickup stage, recycling stage not included
      expect(res.body.data[0].stage).toBe('pickup');
    });
  });

  // GET /consumer/recyclers
  describe('GET /consumer/recyclers', () => {
    it('should get filtered recyclers successfully', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/consumer/recyclers?query=recycler`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0]).toHaveProperty('firebaseUid', 'recycler1');
      expect(res.body.data[0]).toHaveProperty('email', 'recycler1@example.com');
      expect(AuthHandler.GetFilteredUsers).toHaveBeenCalledWith(
        'recycler',
        ROLES.RECYCLER,
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/consumer/recyclers?query=recycler`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when get filtered users fails', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/consumer/recyclers?query=error`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  // POST /consumer/waste
  describe('POST /consumer/waste', () => {
    it('should create waste bottle successfully', async () => {
      const spy = jest
        .spyOn(WatcherRepository, 'CreateWatcher')
        .mockResolvedValue({
          ok: true,
          status: StatusCodes.CREATED,
          data: {
            id: 1,
            wasteBottleId: 1,
            userAccountId: '0x1234567890abcdef',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        });

      const wasteBottleData = {
        trackingCode: 'track-123',
        owner: 'userRole-CONSUMER', // Owner's firebase UID
      };

      const res = await request(app)
        .post(`${BASE_PATH}/consumer/waste`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .send(wasteBottleData)
        .expect(201);

      expect(res.body.status).toBe(201);
      expect(res.body.data).toHaveProperty('bottleId', 1);
      expect(blockchainHelper.callContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'createWasteBottle',
        wasteBottleData.trackingCode,
        expect.any(String),
        expect.any(String),
        expect.any(String),
      );
      expect(WatcherRepository.CreateWatcher).toHaveBeenCalled();

      // Restore the spy
      spy.mockRestore();
    });

    it('should return 401 when user is not authenticated', async () => {
      const wasteBottleData = {
        trackingCode: 'track-123',
        owner: 'userRole-CONSUMER',
      };

      const res = await request(app)
        .post(`${BASE_PATH}/consumer/waste`)
        .set('Authorization', `Bearer invalid-token`)
        .send(wasteBottleData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when request body is invalid', async () => {
      const invalidData = {
        trackingCode: 123, // Should be string
        owner: 'userRole-CONSUMER',
      };

      const res = await request(app)
        .post(`${BASE_PATH}/consumer/waste`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .send(invalidData)
        .expect(400);

      expect(res.body.status).toBe(400);
    });

    it('should return 401 when user is not found', async () => {
      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.UNAUTHORIZED,
        data: null,
      });

      const wasteBottleData = {
        trackingCode: 'track-123',
        owner: 'userRole-CONSUMER',
      };

      const res = await request(app)
        .post(`${BASE_PATH}/consumer/waste`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .send(wasteBottleData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when owner is not found', async () => {
      const wasteBottleData = {
        trackingCode: 'track-123',
        owner: 'invalid-uid', // This will trigger not found
      };

      const res = await request(app)
        .post(`${BASE_PATH}/consumer/waste`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .send(wasteBottleData)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when tracking code is invalid', async () => {
      const wasteBottleData = {
        trackingCode: 'invalid-code', // This will trigger not found
        owner: 'userRole-CONSUMER',
      };

      const res = await request(app)
        .post(`${BASE_PATH}/consumer/waste`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .send(wasteBottleData)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBeNull();
    });

    it('should return 404 when tracking code is valid but not sold yet', async () => {
      // Override GetBatchByTrackingCode for this test
      jest
        .spyOn(SecondaryProducerHandler, 'GetBatchByTrackingCode')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            quantity: 100,
            availableQuantity: 100, // Not sold yet
            originBaseBatchId: 1,
            trackingCode: 'track-123',
            owner: '0x1234567890abcdef',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        });

      const wasteBottleData = {
        trackingCode: 'track-123', // This will trigger not found
        owner: 'userRole-CONSUMER',
      };

      const res = await request(app)
        .post(`${BASE_PATH}/consumer/waste`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .send(wasteBottleData)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when waste bottle creation fails', async () => {
      // Override callContractMethod for this test
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      });

      const wasteBottleData = {
        trackingCode: 'track-123',
        owner: 'userRole-CONSUMER',
      };

      const res = await request(app)
        .post(`${BASE_PATH}/consumer/waste`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .send(wasteBottleData)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when watcher creation fails', async () => {
      // Override CreateWatcher for this test
      jest.spyOn(WatcherRepository, 'CreateWatcher').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      });

      const wasteBottleData = {
        trackingCode: 'track-123',
        owner: 'userRole-CONSUMER',
      };

      const res = await request(app)
        .post(`${BASE_PATH}/consumer/waste`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .send(wasteBottleData)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when ownership creation fails', async () => {
      // Mock OwnershipRepository.CreateOwnership for this test
      const createOwnershipSpy = jest
        .spyOn(OwnershipRepository, 'CreateOwnership')
        .mockResolvedValue({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        });

      const wasteBottleData = {
        trackingCode: 'track-123',
        owner: 'userRole-CONSUMER',
      };

      const res = await request(app)
        .post(`${BASE_PATH}/consumer/waste`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .send(wasteBottleData)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
      expect(createOwnershipSpy).toHaveBeenCalled();

      // Restore the spy
      createOwnershipSpy.mockRestore();
    });
  });

  // DELETE /consumer/waste/:id
  describe('DELETE /consumer/waste/:id', () => {
    it('should delete waste bottle successfully', async () => {
      const bottleId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/consumer/waste/${bottleId}`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeNull();
      expect(blockchainHelper.callContractMethod).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        'deleteWasteBottle',
        bottleId,
        expect.any(String),
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      const bottleId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/consumer/waste/${bottleId}`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 400 when bottle ID is invalid', async () => {
      const res = await request(app)
        .delete(`${BASE_PATH}/consumer/waste/invalid-id`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid bottle ID');
    });

    it('should return 401 when user is not found', async () => {
      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.UNAUTHORIZED,
        data: null,
      });

      const bottleId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/consumer/waste/${bottleId}`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should return 404 when bottle is not found', async () => {
      const bottleId = 999; // This ID will trigger not found in our mock

      const res = await request(app)
        .delete(`${BASE_PATH}/consumer/waste/${bottleId}`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should return 403 when user is not the owner of the bottle', async () => {
      // Override the GetUserByFirebaseUid mock for this test
      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: {
          id: 1,
          firebaseUid: 'test-user',
          email: 'test@example.com',
          blockchainId: '0xdifferent', // Different from the bottle owner
        },
      });

      const bottleId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/consumer/waste/${bottleId}`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(403);

      expect(res.body.status).toBe(403);
      expect(res.body.data).toBeNull();
    });

    it('should return 409 when bottle is already recycled', async () => {
      const bottleId = 2; // This ID has recycledBatchId set to 1 in our mock

      const res = await request(app)
        .delete(`${BASE_PATH}/consumer/waste/${bottleId}`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(409);

      expect(res.body.status).toBe(409);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when waste bottle deletion fails', async () => {
      // Override callContractMethod for this test
      const deleteBottleSpy = jest
        .spyOn(blockchainHelper, 'callContractMethod')
        .mockImplementation(
          async (contractAddress, abi, methodName, ...args) => {
            if (methodName === 'deleteWasteBottle') {
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
          },
        );

      const bottleId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/consumer/waste/${bottleId}`)
        .set('Authorization', `Bearer userWithId-userRole-CONSUMER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
      expect(deleteBottleSpy).toHaveBeenCalled();

      // Restore the original implementation
      deleteBottleSpy.mockRestore();
    });
  });

  describe('ConsumerHandler', () => {
    it('should get waste bottle by id', async () => {
      const bottleId = 1; // This ID will trigger not found in our mock

      const res = await ConsumerHandler.GetWasteBottleById(bottleId);

      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('id', bottleId);
      expect(res.data).toHaveProperty('trackingCode', 'track-123');
    });

    it('should get waste bottles list', async () => {
      const bottleIds = [1, 2]; // This ID will trigger not found in our mock

      const res = await ConsumerHandler.GetWasteBottlesList(bottleIds);

      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);
      expect(res.data).toBeInstanceOf(Array);
      expect(res.data?.length).toBe(2);
      expect(res.data?.[0]).toHaveProperty('id', 1);
      expect(res.data?.[0]).toHaveProperty('trackingCode', 'track-1');
    });
  });
});
