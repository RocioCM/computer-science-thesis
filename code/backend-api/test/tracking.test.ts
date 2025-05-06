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
import ConsumerHandler from '../src/modules/consumer/consumerHandler';
import RecyclerHandler from '../src/modules/recycler/recyclerHandler';
import ProducerHandler from '../src/modules/producer/producerHandler';
import SecondaryProducerHandler from '../src/modules/secondaryProducer/secondaryProducerHandler';
import OwnershipRepository from '../src/modules/tracking/repositories/ownershipRepository';

// Mock blockchain helper
jest.mock('../src/pkg/helpers/blockchainHelper', () => ({
  callContractMethod: jest
    .fn()
    .mockImplementation(async (_contractAddress, _abi, methodName, ...args) => {
      return {
        ok: true,
        status: StatusCodes.OK,
        data: [],
      };
    }),
  callPureContractMethod: jest
    .fn()
    .mockImplementation(async (_contractAddress, _abi, methodName, ...args) => {
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
            creator: '0xabcdef1234567890',
            recycledBatchId: 0,
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        };
      }
      return {
        ok: true,
        status: StatusCodes.OK,
        data: {},
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
  GetUserByBlockchainId: jest.fn().mockImplementation(async (blockchainId) => {
    if (blockchainId === 'invalid-blockchain-id') {
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
        blockchainId,
        userName: 'Test User',
        phone: '+123456789',
      },
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
        soldQuantity: 100,
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

// Mock SecondaryProducerHandler
jest.mock('../src/modules/secondaryProducer/secondaryProducerHandler', () => ({
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
        quantity: 100,
        availableQuantity: 80,
        originBaseBatchId: 1,
        trackingCode: 'track-123',
        owner: '0x1234567890abcdef',
        createdAt: new Date().toISOString(),
        deletedAt: '',
      },
    };
  }),
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
}));

// Mock ConsumerHandler
jest.mock('../src/modules/consumer/consumerHandler', () => ({
  GetWasteBottleById: jest.fn().mockImplementation(async (id) => {
    if (id === 999) {
      return {
        ok: false,
        status: StatusCodes.NOT_FOUND,
        data: null,
      };
    }
    if (id === 888) {
      return {
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
    return {
      ok: true,
      status: StatusCodes.OK,
      data: {
        id,
        trackingCode: 'track-123',
        owner: '0x1234567890abcdef',
        creator: '0xabcdef1234567890',
        recycledBatchId: 0,
        createdAt: new Date().toISOString(),
        deletedAt: '',
      },
    };
  }),
}));

// Mock RecyclerHandler
jest.mock('../src/modules/recycler/recyclerHandler', () => ({
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
        composition: [{ name: 'Glass', amount: 100, measureUnit: 'kg' }],
        creator: '0x1234567890abcdef',
        createdAt: new Date().toISOString(),
        deletedAt: '',
      },
    };
  }),
  GetBottlesIdsListForBatch: jest.fn().mockImplementation(async (batchId) => {
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
      data: [1, 2, 3, 4, 5],
    };
  }),
}));

describe('Tracking API', () => {
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

  // GET /tracking/user/:blockchainId
  describe('GET /tracking/user/:blockchainId', () => {
    it('should get user public data successfully', async () => {
      const blockchainId = '0x1234567890abcdef';

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/user/${blockchainId}`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toHaveProperty('blockchainId', blockchainId);
      expect(res.body.data).toHaveProperty('email', 'test@example.com');
      expect(res.body.data).toHaveProperty('userName', 'Test User');
      expect(res.body.data).toHaveProperty('phone', '+123456789');
      expect(AuthHandler.GetUserByBlockchainId).toHaveBeenCalledWith(
        blockchainId,
      );
    });

    it('should return 404 when user is not found', async () => {
      const blockchainId = 'invalid-blockchain-id';

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/user/${blockchainId}`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });
  });

  // GET /tracking/base-batch/:id
  describe('GET /tracking/base-batch/:id', () => {
    it('should get base batch by ID successfully', async () => {
      const batchId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/base-batch/${batchId}`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toHaveProperty('id', batchId);
      expect(res.body.data).toHaveProperty('quantity', 200);
      expect(res.body.data.bottleType).toHaveProperty('color', 'green');
      expect(ProducerHandler.GetBatchById).toHaveBeenCalledWith(batchId);
    });

    it('should return 400 when batch ID is invalid', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/tracking/base-batch/invalid-id`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });

    it('should return 404 when batch is not found', async () => {
      const batchId = 999; // ID that will trigger not found in the mock

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/base-batch/${batchId}`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it("should return 404 when base batch isn't sold yet", async () => {
      jest.spyOn(ProducerHandler, 'GetBatchById').mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: {
          id: 1,
          quantity: 200,
          soldQuantity: 0,
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
      const batchId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/base-batch/${batchId}`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });
  });

  // GET /tracking/base-batch/:id/products
  describe('GET /tracking/base-batch/:id/products', () => {
    it('should get all products from base batch successfully', async () => {
      const batchId = 1;
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsWithFilters')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [
            {
              id: 1,
              bottleId: 1,
              originBatchId: batchId,
              type: OWNERSHIP_TYPES.PRODUCT,
              ownerAccountId: '0x1234567890abcdef',
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
            {
              id: 2,
              bottleId: 2,
              originBatchId: batchId,
              type: OWNERSHIP_TYPES.PRODUCT,
              ownerAccountId: '0x1234567890abcdef',
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
            {
              id: 3,
              bottleId: 3,
              originBatchId: batchId,
              type: OWNERSHIP_TYPES.PRODUCT,
              ownerAccountId: '0x1234567890abcdef',
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
          ],
        });

      const res = await request(app)
        .get(
          `${BASE_PATH}/tracking/base-batch/${batchId}/products?page=1&limit=10`,
        )
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).toEqual([1, 2, 3]);
      expect(OwnershipRepository.GetOwnershipsWithFilters).toHaveBeenCalledWith(
        { type: OWNERSHIP_TYPES.PRODUCT, originBatchId: batchId },
        1,
        10,
      );

      spy.mockRestore();
    });

    it('should return empty array when no products are found', async () => {
      const batchId = 1;

      // Ownership repository by default returns empty array as DB is empty.

      const res = await request(app)
        .get(
          `${BASE_PATH}/tracking/base-batch/${batchId}/products?page=1&limit=10`,
        )
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).toEqual([]);
    });

    it('should use default pagination values when not provided', async () => {
      const batchId = 1;
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsWithFilters')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [
            {
              id: 1,
              bottleId: 1,
              originBatchId: batchId,
              type: OWNERSHIP_TYPES.PRODUCT,
              ownerAccountId: '0x1234567890abcdef',
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
          ],
        });

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/base-batch/${batchId}/products`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(OwnershipRepository.GetOwnershipsWithFilters).toHaveBeenCalledWith(
        { type: OWNERSHIP_TYPES.PRODUCT, originBatchId: batchId },
        1,
        10,
      );

      spy.mockRestore();
    });

    it('should return 400 when batch ID is invalid', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/tracking/base-batch/invalid-id/products`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });

    it('should return 500 when ownership repository fails', async () => {
      const batchId = 1;
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsWithFilters')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        });

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/base-batch/${batchId}/products`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();

      spy.mockRestore();
    });
  });

  // GET /tracking/product-batch/:id
  describe('GET /tracking/product-batch/:id', () => {
    it('should get product batch by ID successfully', async () => {
      const batchId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/product-batch/${batchId}`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toHaveProperty('id', batchId);
      expect(res.body.data).toHaveProperty('quantity', 100);
      expect(res.body.data).toHaveProperty('trackingCode', 'track-123');
      expect(SecondaryProducerHandler.GetBatchById).toHaveBeenCalledWith(
        batchId,
      );
    });

    it('should return 400 when batch ID is invalid', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/tracking/product-batch/invalid-id`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });

    it('should return 404 when batch is not found', async () => {
      const batchId = 999; // ID that will trigger not found in the mock

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/product-batch/${batchId}`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });
  });

  // GET /tracking/product-batch/trackingCode/:code
  describe('GET /tracking/product-batch/trackingCode/:code', () => {
    it('should get product batch by tracking code successfully', async () => {
      const trackingCode = 'track-123';

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/product-batch/trackingCode/${trackingCode}`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toHaveProperty('trackingCode', trackingCode);
      expect(res.body.data).toHaveProperty('quantity', 100);
      expect(
        SecondaryProducerHandler.GetBatchByTrackingCode,
      ).toHaveBeenCalledWith(trackingCode);
    });

    it('should return 400 when tracking code is not provided', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/tracking/product-batch/trackingCode/`)
        .expect(400);

      expect(res.status).toBe(400);
    });

    it('should return 404 when batch is not found', async () => {
      const trackingCode = 'invalid-code'; // This will trigger not found in the mock

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/product-batch/trackingCode/${trackingCode}`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it("should return 404 when product batch isn't sold yet", async () => {
      jest
        .spyOn(SecondaryProducerHandler, 'GetBatchByTrackingCode')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            quantity: 100,
            availableQuantity: 100,
            originBaseBatchId: 1,
            trackingCode: 'track-123',
            owner: '0x1234567890abcdef',
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        });
      const trackingCode = 'track-123';

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/product-batch/trackingCode/${trackingCode}`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });
  });

  // GET /tracking/product-batch/:id/waste-bottles
  describe('GET /tracking/product-batch/:id/waste-bottles', () => {
    it('should get waste bottles from product batch successfully', async () => {
      const batchId = 1;
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsWithFilters')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [
            {
              id: 1,
              bottleId: 1,
              originBatchId: batchId,
              type: OWNERSHIP_TYPES.WASTE,
              ownerAccountId: '0x1234567890abcdef',
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
            {
              id: 2,
              bottleId: 2,
              originBatchId: batchId,
              type: OWNERSHIP_TYPES.WASTE,
              ownerAccountId: '0x1234567890abcdef',
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
            {
              id: 3,
              bottleId: 3,
              originBatchId: batchId,
              type: OWNERSHIP_TYPES.WASTE,
              ownerAccountId: '0x1234567890abcdef',
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
          ],
        });

      const res = await request(app)
        .get(
          `${BASE_PATH}/tracking/product-batch/${batchId}/waste-bottles?page=1&limit=10`,
        )
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).toEqual([1, 2, 3]);
      expect(OwnershipRepository.GetOwnershipsWithFilters).toHaveBeenCalledWith(
        { type: OWNERSHIP_TYPES.WASTE, originBatchId: batchId },
        1,
        10,
      );

      spy.mockRestore();
    });

    it('should use default pagination values when not provided', async () => {
      const batchId = 1;
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsWithFilters')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [
            {
              id: 1,
              bottleId: 1,
              originBatchId: batchId,
              type: OWNERSHIP_TYPES.WASTE,
              ownerAccountId: '0x1234567890abcdef',
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
          ],
        });

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/product-batch/${batchId}/waste-bottles`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(OwnershipRepository.GetOwnershipsWithFilters).toHaveBeenCalledWith(
        { type: OWNERSHIP_TYPES.WASTE, originBatchId: batchId },
        1,
        10,
      );

      spy.mockRestore();
    });

    it('should return 400 when batch ID is invalid', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/tracking/product-batch/invalid-id/waste-bottles`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });

    it('should return 500 when ownership repository fails', async () => {
      const batchId = 1;
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsWithFilters')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
        });

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/product-batch/${batchId}/waste-bottles`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();

      spy.mockRestore();
    });
  });

  // GET /tracking/waste-bottle/:id
  describe('GET /tracking/waste-bottle/:id', () => {
    it('should get waste bottle by ID successfully', async () => {
      const bottleId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/waste-bottle/${bottleId}`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toHaveProperty('id', bottleId);
      expect(res.body.data).toHaveProperty('trackingCode', 'track-123');
      expect(res.body.data).toHaveProperty('owner', '0x1234567890abcdef');
      expect(ConsumerHandler.GetWasteBottleById).toHaveBeenCalledWith(bottleId);
    });

    it('should return 400 when bottle ID is invalid', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/tracking/waste-bottle/invalid-id`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });

    it('should return 404 when waste bottle is not found', async () => {
      const bottleId = 999; // ID that will trigger not found in the mock

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/waste-bottle/${bottleId}`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });
  });

  // GET /tracking/recycling-batch/:id
  describe('GET /tracking/recycling-batch/:id', () => {
    it('should get recycling batch by ID successfully', async () => {
      const batchId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/recycling-batch/${batchId}`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toHaveProperty('id', batchId);
      expect(res.body.data).toHaveProperty('weight', 500);
      expect(res.body.data).toHaveProperty('materialType', 'Glass');
      expect(RecyclerHandler.GetRecyclingBatchById).toHaveBeenCalledWith(
        batchId,
      );
    });

    it('should return 400 when batch ID is invalid', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/tracking/recycling-batch/invalid-id`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });

    it('should return 404 when recycling batch is not found', async () => {
      const batchId = 999; // ID that will trigger not found in the mock

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/recycling-batch/${batchId}`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });
  });

  // GET /tracking/recycling-batch/:id/waste-bottles
  describe('GET /tracking/recycling-batch/:id/waste-bottles', () => {
    it('should get waste bottles from recycling batch successfully', async () => {
      const batchId = 1;

      const res = await request(app)
        .get(
          `${BASE_PATH}/tracking/recycling-batch/${batchId}/waste-bottles?page=1&limit=2`,
        )
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2); // Should match the limit (2)
      expect(res.body.data[0]).toHaveProperty('id', 1);
      expect(res.body.data[1]).toHaveProperty('id', 2);
      expect(RecyclerHandler.GetBottlesIdsListForBatch).toHaveBeenCalledWith(
        batchId,
      );
      expect(ConsumerHandler.GetWasteBottleById).toHaveBeenCalledTimes(2);
    });

    it('should use default pagination values when not provided', async () => {
      const batchId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/recycling-batch/${batchId}/waste-bottles`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(RecyclerHandler.GetBottlesIdsListForBatch).toHaveBeenCalledWith(
        batchId,
      );
    });

    it('should return 400 when batch ID is invalid', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/tracking/recycling-batch/invalid-id/waste-bottles`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });

    it('should return 404 when recycling batch is not found', async () => {
      const batchId = 999; // ID that will trigger not found in the mock

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/recycling-batch/${batchId}/waste-bottles`)
        .expect(500); // It returns 500 because of the way the handler is implemented

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });

    it('should return 500 when there is an error getting waste bottles', async () => {
      const batchId = 1;

      // Mock GetWasteBottleById to return error for bottle with ID 888
      jest
        .spyOn(RecyclerHandler, 'GetBottlesIdsListForBatch')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [888], // This will trigger an error when getting the bottle
        });

      const res = await request(app)
        .get(`${BASE_PATH}/tracking/recycling-batch/${batchId}/waste-bottles`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });
});
