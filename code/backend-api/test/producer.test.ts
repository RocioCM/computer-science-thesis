import request from 'supertest';
import {
  cleanupTestDatabase,
  setupTestEnvironment,
  teardownTestEnvironment,
} from './utils';
import app from '../src/internal/server';
import { BASE_PATH, ROLES } from '../src/pkg/constants';
import { StatusCodes } from 'http-status-codes';
import blockchainHelper from '../src/pkg/helpers/blockchainHelper';
import AuthHandler from '../src/modules/auth/authHandler';
import OwnershipRepository from '../src/modules/producer/repositories/ownershipRepository';
import RecyclerHandler from '../src/modules/recycler/recyclerHandler';

// Mock blockchain helper
jest.mock('../src/pkg/helpers/blockchainHelper', () => ({
  callContractMethod: jest.fn(),
  callPureContractMethod: jest
    .fn()
    .mockImplementation(async (_contract, _abi, methodName, id) => {
      if (methodName === 'getBaseBottlesBatch') {
        return {
          ok: true,
          status: StatusCodes.OK,
          data: {
            id,
            quantity: 100,
            soldQuantity: 1,
            owner: '0x1234567890abcdef',
            bottleType: {
              weight: 500,
              color: 'green',
              thickness: 2,
              shapeType: 'round',
              originLocation: 'Argentina',
              extraInfo: 'Recycled glass',
              composition:
                '[{ "name": "Glass", "amount": 100, "measureUnit": "kg" }]',
            },
            createdAt: new Date().toISOString(),
            deletedAt: '',
          },
        };
      } else if (methodName === 'getBaseBottlesList') {
        return {
          ok: true,
          status: StatusCodes.OK,
          data: id.map((batchId: number) => ({
            id: batchId,
            quantity: 100,
            bottleType: {
              weight: 500,
              color: 'green',
              thickness: 2,
              shapeType: 'round',
              originLocation: 'Argentina',
              extraInfo: 'Recycled glass',
              composition:
                '[{ "name": "Glass", "amount": 100, "measureUnit": "kg" }]',
            },
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
  GetUserByFirebaseUid: jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    data: { blockchainId: '0x1234567890abcdef' },
  }),
  GetUserWithAuth: jest.fn(),
  GetFilteredUsers: jest.fn(),
}));

// Mock recycler handler
jest.mock('../src/modules/recycler/recyclerHandler', () => ({
  GetRecyclingBatchById: jest.fn(),
  GetAllUserRecyclingBatches: jest.fn(),
}));

describe('Producer API', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
    jest.clearAllMocks(); // Clear mocks before each test
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  describe('POST /producer/batch', () => {
    it('should create a new base bottles batch', async () => {
      // Mock blockchain helper function for creating a new batch
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

      const res = await request(app)
        .post(`${BASE_PATH}/producer/batch`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(newBatch)
        .expect(201);

      expect(res.body.status).toBe(201);
      expect(res.body.data.batchId).toBe(1);
    });

    it('should not create batch if invalid body', async () => {
      const invalidBatch = {
        quantity: '100',
      };

      const res = await request(app)
        .post(`${BASE_PATH}/producer/batch`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(invalidBatch)
        .expect(400);

      expect(res.body.status).toBe(400);
    });

    it('should not create batch if user is not authenticated', async () => {
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

      const res = await request(app)
        .post(`${BASE_PATH}/producer/batch`)
        .set('Authorization', `Bearer invalid-token`)
        .send(newBatch)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it("should handle create error when user doesn't exist", async () => {
      // Mock AuthHandler.GetUserByFirebaseUid to return an error
      jest
        .spyOn(AuthHandler, 'GetUserByFirebaseUid')
        .mockResolvedValueOnce({ ok: false, status: 404, data: null });

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

      const res = await request(app)
        .post(`${BASE_PATH}/producer/batch`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(newBatch)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should handle create error when blockchain fails', async () => {
      // Mock blockchain helper function for creating a new batch
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
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

      const res = await request(app)
        .post(`${BASE_PATH}/producer/batch`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(newBatch)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });

    it('should handle create error when ownership repository fails', async () => {
      // Mock OwnershipRepository.CreateOwnership to return an error
      const spy = jest
        .spyOn(OwnershipRepository, 'CreateOwnership')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          data: null,
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

      const res = await request(app)
        .post(`${BASE_PATH}/producer/batch`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(newBatch)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();

      spy.mockRestore(); // Restore the original implementation
    });
  });

  describe('GET /producer/batch/:id', () => {
    it('should get a batch by ID', async () => {
      const batchId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/producer/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data.id).toBe(batchId);
      expect(res.body.data.quantity).toBe(100);
    });

    it('should not get batch if not authenticated', async () => {
      const batchId = 1;

      const res = await request(app)
        .get(`${BASE_PATH}/producer/batch/${batchId}`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should handle get error when batch ID is invalid', async () => {
      const batchId = 'invalid-id';

      const res = await request(app)
        .get(`${BASE_PATH}/producer/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });
  });

  describe('PUT /producer/batch', () => {
    it('should update a base bottles batch', async () => {
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
        .put(`${BASE_PATH}/producer/batch`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(updatedBatch)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeNull();
    });

    it('should not update batch if user is not authenticated', async () => {
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
        .put(`${BASE_PATH}/producer/batch`)
        .set('Authorization', `Bearer invalid-token`)
        .send(updatedBatch)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should not update batch if invalid body', async () => {
      const invalidBatch = {
        id: 1,
        quantity: '150',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/producer/batch`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(invalidBatch)
        .expect(400);

      expect(res.body.status).toBe(400);
    });

    it("should handle update error when user doesn't exist", async () => {
      // Mock AuthHandler.GetUserByFirebaseUid to return an error
      jest
        .spyOn(AuthHandler, 'GetUserByFirebaseUid')
        .mockResolvedValueOnce({ ok: false, status: 404, data: null });

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
        .put(`${BASE_PATH}/producer/batch`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(updatedBatch)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it("should handle update error when batch doesn't exist", async () => {
      // Mock blockchain helper function for updating a batch
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.NOT_FOUND,
          data: null,
        });

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
        .put(`${BASE_PATH}/producer/batch`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(updatedBatch)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should not update a base bottles batch from other owner', async () => {
      // Mock AuthHandler.GetUserByFirebaseUid to return other valid user
      (AuthHandler.GetUserByFirebaseUid as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: { blockchainId: '0xsome-other-id' },
      });

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
        .put(`${BASE_PATH}/producer/batch`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(updatedBatch)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });
  });

  describe('DELETE /producer/batch/:id', () => {
    it('should delete a base bottles batch', async () => {
      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/producer/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeNull();
    });

    it("should handle delete error when user doesn't exist", async () => {
      // Mock AuthHandler.GetUserByFirebaseUid to return an error
      jest
        .spyOn(AuthHandler, 'GetUserByFirebaseUid')
        .mockResolvedValueOnce({ ok: false, status: 404, data: null });

      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/producer/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it("should handle delete error when batch doesn't exist", async () => {
      // Mock blockchain helper function for deleting a batch
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.NOT_FOUND,
          data: null,
        });

      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/producer/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should not delete a base bottles batch from other owner', async () => {
      // Mock AuthHandler.GetUserByFirebaseUid to return other valid user
      (AuthHandler.GetUserByFirebaseUid as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: { blockchainId: '0xsome-other-id' },
      });

      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/producer/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should not delete if user is not authenticated', async () => {
      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/producer/batch/${batchId}`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should not delete if id is invalid', async () => {
      const batchId = 'invalid-id';

      const res = await request(app)
        .delete(`${BASE_PATH}/producer/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });

    it('should handle delete error when blockchain fails', async () => {
      // Mock blockchain helper function for deleting a batch
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      });

      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/producer/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });

    it('should call delete ownership when deleting', async () => {
      const spy1 = jest
        .spyOn(OwnershipRepository, 'GetOwnershipByBottleId')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: {
            id: 1,
            bottleId: 1,
            originBatchId: 1,
            type: '',
            ownerAccountId: '',
            createdAt: '',
            deletedAt: '',
          },
        });
      const spy2 = jest.spyOn(OwnershipRepository, 'DeleteOwnershipById');

      const batchId = 1;

      const res = await request(app)
        .delete(`${BASE_PATH}/producer/batch/${batchId}`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeNull();
      expect(OwnershipRepository.DeleteOwnershipById).toHaveBeenCalledWith(
        batchId,
      );

      spy1.mockRestore(); // Restore the original implementation
      spy2.mockRestore(); // Restore the original implementation
    });
  });

  describe('PUT /producer/batch/sell', () => {
    it('should sell base bottles', async () => {
      // Mock blockchain helper function for selling bottles
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValue({
        ok: true,
        status: StatusCodes.OK,
        data: [{ name: 'BaseBottlesSold', args: [0, 0, 1] }],
      });

      const sellData = {
        batchId: 1,
        quantity: 50,
        buyerUid: 'buyer-uid',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/producer/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(sellData)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data.productBatchId).toBe(1);
    });

    it('should not sell base bottles if user is not authenticated', async () => {
      const sellData = {
        batchId: 1,
        quantity: 50,
        buyerUid: 'buyer-uid',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/producer/batch/sell`)
        .set('Authorization', `Bearer invalid-token`)
        .send(sellData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should not sell base bottles if invalid body', async () => {
      const invalidSellData = {
        batchId: 1,
        quantity: '50',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/producer/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(invalidSellData)
        .expect(400);

      expect(res.body.status).toBe(400);
    });

    it("should handle sell error when user doesn't exist", async () => {
      // Mock AuthHandler.GetUserByFirebaseUid to return an error
      jest
        .spyOn(AuthHandler, 'GetUserByFirebaseUid')
        .mockResolvedValueOnce({ ok: false, status: 404, data: null });

      const sellData = {
        batchId: 1,
        quantity: 50,
        buyerUid: 'buyer-uid',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/producer/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(sellData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it("should handle sell error when batch doesn't exist", async () => {
      // Mock blockchain helper function for selling bottles
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.NOT_FOUND,
          data: null,
        });

      const sellData = {
        batchId: 1,
        quantity: 50,
        buyerUid: 'buyer-uid',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/producer/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(sellData)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should not sell base bottles from other owner', async () => {
      // Mock AuthHandler.GetUserByFirebaseUid to return other valid user
      (AuthHandler.GetUserByFirebaseUid as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: { blockchainId: '0xsome-other-id' },
      });

      const sellData = {
        batchId: 1,
        quantity: 50,
        buyerUid: 'buyer-uid',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/producer/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(sellData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should handle selling error when buyer is not found', async () => {
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
        .put(`${BASE_PATH}/producer/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(sellData)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBeNull();
    });

    it('should handle selling error when blockchain fails', async () => {
      // Mock blockchain helper function for selling bottles
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValueOnce({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      });

      const sellData = {
        batchId: 1,
        quantity: 50,
        buyerUid: 'buyer-uid',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/producer/batch/sell`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(sellData)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  describe('PUT /producer/batch/recycle', () => {
    it('should recycle base bottles batch', async () => {
      // Mock blockchain helper function for recycling bottles
      jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: [{ name: 'BaseBottlesRecycled', args: [0, 1] }],
      });

      const recycleData = {
        batchId: 1,
        quantity: 50,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/producer/batch/recycle`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(recycleData)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data.recyclingBatchId).toBe(1);
    });

    it('should not recycle base bottles batch if user is not authenticated', async () => {
      const recycleData = {
        batchId: 1,
        quantity: 50,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/producer/batch/recycle`)
        .set('Authorization', `Bearer invalid-token`)
        .send(recycleData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should not recycle base bottles batch if invalid body', async () => {
      const invalidRecycleData = {
        batchId: 1,
        quantity: '50',
      };

      const res = await request(app)
        .put(`${BASE_PATH}/producer/batch/recycle`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(invalidRecycleData)
        .expect(400);

      expect(res.body.status).toBe(400);
    });

    it("should handle recycle error when user doesn't exist", async () => {
      // Mock AuthHandler.GetUserByFirebaseUid to return an error
      jest
        .spyOn(AuthHandler, 'GetUserByFirebaseUid')
        .mockResolvedValueOnce({ ok: false, status: 404, data: null });

      const recycleData = {
        batchId: 1,
        quantity: 50,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/producer/batch/recycle`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(recycleData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it("should handle recycle error when batch doesn't exist", async () => {
      // Mock blockchain helper function for recycling a batch
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        .mockResolvedValueOnce({
          ok: false,
          status: StatusCodes.NOT_FOUND,
          data: null,
        });

      const recycleData = {
        batchId: 1,
        quantity: 50,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/producer/batch/recycle`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(recycleData)
        .expect(404);

      expect(res.body.status).toBe(404);
      expect(res.body.data).toBeNull();
    });

    it('should not recycle a base bottles batch from other owner', async () => {
      // Mock AuthHandler.GetUserByFirebaseUid to return other valid user
      (AuthHandler.GetUserByFirebaseUid as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: StatusCodes.OK,
        data: { blockchainId: '0xsome-other-id' },
      });

      const recycleData = {
        batchId: 1,
        quantity: 50,
      };

      const res = await request(app)
        .put(`${BASE_PATH}/producer/batch/recycle`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .send(recycleData)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });
  });

  describe('GET /producer/batches/user', () => {
    it('should get all batches for authenticated user', async () => {
      // Mock blockchain helper
      jest
        .spyOn(blockchainHelper, 'callPureContractMethod')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [
            {
              id: 1,
              quantity: 100,
              bottleType: {
                weight: 500,
                color: 'green',
                thickness: 2,
                shapeType: 'round',
                originLocation: 'Argentina',
                extraInfo: 'Recycled glass',
                composition: '[]',
              },
              owner: '0x1234567890abcdef',
            },
            {
              id: 2,
              quantity: 150,
              bottleType: {
                weight: 500,
                color: 'blue',
                thickness: 2,
                shapeType: 'round',
                originLocation: 'Argentina',
                extraInfo: 'Recycled glass',
                composition: '[]',
              },
              owner: '0x1234567890abcdef',
            },
          ],
        });

      const res = await request(app)
        .get(`${BASE_PATH}/producer/batches/user?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(AuthHandler.GetUserByFirebaseUid).toHaveBeenCalled();
      expect(blockchainHelper.callPureContractMethod).toHaveBeenCalled();
    });

    it('should handle unauthorized user', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/producer/batches/user?page=1&limit=10`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should use default pagination values when not provided', async () => {
      const spy = jest
        .spyOn(OwnershipRepository, 'GetOwnershipsByAccountId')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [
            {
              id: 1,
              bottleId: 1,
              originBatchId: 1,
              type: 'base',
              ownerAccountId: '0x1234567890abcdef',
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
          ],
        });

      const res = await request(app)
        .get(`${BASE_PATH}/producer/batches/user`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(OwnershipRepository.GetOwnershipsByAccountId).toHaveBeenCalledWith(
        expect.any(String),
        1,
        10,
      );

      spy.mockRestore(); // Restore the original implementation
    });

    it("should handle error when user doesn't exist", async () => {
      // Mock AuthHandler.GetUserByFirebaseUid to return an error
      jest
        .spyOn(AuthHandler, 'GetUserByFirebaseUid')
        .mockResolvedValueOnce({ ok: false, status: 404, data: null });

      const res = await request(app)
        .get(`${BASE_PATH}/producer/batches/user?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should handle error when ownership repository fails', async () => {
      // Mock OwnershipRepository.GetOwnershipsByAccountId to return an error
      jest
        .spyOn(OwnershipRepository, 'GetOwnershipsByAccountId')
        .mockResolvedValue({
          ok: false,
          status: 500,
          data: null,
        });

      const res = await request(app)
        .get(`${BASE_PATH}/producer/batches/user?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  describe('GET /producer/buyers', () => {
    it('should get filtered buyers successfully', async () => {
      // Mock AuthHandler.GetFilteredUsers to return buyers
      jest.spyOn(AuthHandler, 'GetFilteredUsers').mockResolvedValueOnce({
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
      });

      const res = await request(app)
        .get(`${BASE_PATH}/producer/buyers?query=buyer`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0]).toHaveProperty('firebaseUid', 'buyer1');
      expect(res.body.data[0]).toHaveProperty('email', 'buyer1@example.com');
      expect(AuthHandler.GetFilteredUsers).toHaveBeenCalledWith(
        'buyer',
        ROLES.SECONDARY_PRODUCER,
      );
    });

    it('should handle unauthorized user', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/producer/buyers?query=buyer`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should handle error from GetFilteredUsers', async () => {
      // Mock user authentication
      jest.spyOn(AuthHandler, 'GetUserByFirebaseUid').mockResolvedValue({
        ok: true,
        status: StatusCodes.OK,
        data: {
          id: 1,
          firebaseUid: 'test-user',
          email: 'test@example.com',
          blockchainId: '0x1234567890abcdef',
        },
      });

      // Mock AuthHandler.GetFilteredUsers to return an error
      jest.spyOn(AuthHandler, 'GetFilteredUsers').mockResolvedValue({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      });

      const res = await request(app)
        .get(`${BASE_PATH}/producer/buyers?query=buyer`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(500);

      expect(res.body.status).toBe(500);
      expect(res.body.data).toBeNull();
    });
  });

  // Tests for GetRecyclingBatchById endpoint
  describe('GET /producer/recycled-batch/:id', () => {
    it('should get recycling batch by ID successfully', async () => {
      // Mock RecyclerHandler.GetRecyclingBatchById to return a batch
      jest.spyOn(RecyclerHandler, 'GetRecyclingBatchById').mockResolvedValue({
        ok: true,
        status: StatusCodes.OK,
        data: {
          id: 1,
          weight: 500,
          size: 'large',
          materialType: 'Glass',
          composition: [
            { name: 'Recycled material', amount: 100, measureUnit: '%' },
          ],
          extraInfo: '',
          buyerOwner: '',
          wasteBottleIds: [1, 2],
          creator: '0x1234567890abcdef',
          createdAt: new Date().toISOString(),
          deletedAt: '',
        },
      });

      const res = await request(app)
        .get(`${BASE_PATH}/producer/recycled-batch/1`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toHaveProperty('id', 1);
      expect(RecyclerHandler.GetRecyclingBatchById).toHaveBeenCalledWith(1);
    });

    it('should handle unauthorized user', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/producer/recycled-batch/1`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should handle invalid batch ID', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/producer/recycled-batch/invalid-id`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(400);

      expect(res.body.status).toBe(400);
      expect(res.body.data).toBe('Invalid batch ID');
    });
  });

  // Tests for GetAllUserRecyclingBatches endpoint
  describe('GET /producer/recycled-batches', () => {
    it('should get all user recycling batches successfully', async () => {
      // Mock RecyclerHandler.GetAllUserRecyclingBatches to return batches
      jest
        .spyOn(RecyclerHandler, 'GetAllUserRecyclingBatches')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [
            {
              id: 1,
              weight: 500,
              size: 'large',
              materialType: 'Glass',
              composition: [
                { name: 'Recycled material', amount: 100, measureUnit: '%' },
              ],
              extraInfo: '',
              buyerOwner: '',
              wasteBottleIds: [1, 2],
              creator: '0x1234567890abcdef',
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
            {
              id: 2,
              weight: 500,
              size: 'large',
              materialType: 'Glass',
              composition: [
                { name: 'Recycled material', amount: 100, measureUnit: '%' },
              ],
              extraInfo: '',
              buyerOwner: '',
              wasteBottleIds: [1, 2],
              creator: '0x1234567890abcdef',
              createdAt: new Date().toISOString(),
              deletedAt: '',
            },
          ],
        });

      const res = await request(app)
        .get(`${BASE_PATH}/producer/recycled-batches?page=1&limit=10`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(RecyclerHandler.GetAllUserRecyclingBatches).toHaveBeenCalledWith(
        expect.any(String),
        1,
        10,
        true,
      );
    });

    it('should handle unauthorized user', async () => {
      const res = await request(app)
        .get(`${BASE_PATH}/producer/recycled-batches?page=1&limit=10`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);

      expect(res.body.status).toBe(401);
      expect(res.body.data).toBeNull();
    });

    it('should use default pagination values when not provided', async () => {
      // Mock RecyclerHandler.GetAllUserRecyclingBatches
      jest
        .spyOn(RecyclerHandler, 'GetAllUserRecyclingBatches')
        .mockResolvedValueOnce({
          ok: true,
          status: StatusCodes.OK,
          data: [],
        });

      const res = await request(app)
        .get(`${BASE_PATH}/producer/recycled-batches`)
        .set('Authorization', `Bearer userWithId-userRole-PRODUCER`)
        .expect(200);

      expect(res.body.status).toBe(200);
      expect(RecyclerHandler.GetAllUserRecyclingBatches).toHaveBeenCalledWith(
        expect.any(String),
        1,
        10,
        true,
      );
    });
  });
});
