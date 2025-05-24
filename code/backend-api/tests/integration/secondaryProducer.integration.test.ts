import request from 'supertest';
import app from '../../src/internal/server';
import { BASE_PATH, ROLES } from 'src/pkg/constants';
import {
  setupBlockchainEnvironment,
  setupTestEnvironment,
  teardownTestEnvironment,
} from '../utils';
import {
  UpdateTrackingCodeDTO,
  RecycleBaseBottlesDTO,
  SellProductBottlesDTO,
} from 'src/modules/secondaryProducer/domain/productBatch';

describe('Integration: Secondary Producer', () => {
  let baseBatchId: number;
  let productBatchId: number;

  const primaryUser = {
    email: 'primary@example.com',
    password: 'TestPassword123',
    roleId: ROLES.PRODUCER,
  };
  const primaryAuthHeader = {
    Authorization: 'Bearer userWithId-userRole-PRODUCER-primary',
  };

  const secondaryUser = {
    email: 'secondary@example.com',
    password: 'TestPassword123',
    roleId: ROLES.SECONDARY_PRODUCER,
  };
  const secondaryAuthHeader = {
    Authorization: 'Bearer userWithId-userRole-SECONDARY_PRODUCER-secondary',
  };
  const secondaryUid = 'secondary';
  beforeAll(async () => {
    await setupTestEnvironment();
    await setupBlockchainEnvironment();

    // Register primary producer
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(primaryUser)
      .expect(201);

    // Create base batch
    const batchData = {
      quantity: 100,
      bottleType: {
        weight: 500,
        color: 'green',
        thickness: 2,
        shapeType: 'round',
        originLocation: 'Argentina',
        extraInfo: 'Recycled glass',
        composition: [],
      },
      createdAt: new Date('2025-01-01').toISOString(),
    };
    const createBatchRes = await request(app)
      .post(BASE_PATH + '/producer/batch')
      .set(primaryAuthHeader)
      .send(batchData)
      .expect(201);
    baseBatchId = createBatchRes.body.data.batchId;

    // Register secondary producer
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(secondaryUser)
      .expect(201); // Sell base batch to secondary producer
    const sellData = {
      batchId: baseBatchId,
      quantity: 50,
      buyerUid: secondaryUid,
    };
    const sellRes = await request(app)
      .put(BASE_PATH + '/producer/batch/sell')
      .set(primaryAuthHeader)
      .send(sellData)
      .expect(200);
    productBatchId = sellRes.body.data.productBatchId;
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });
  it('should assign tracking code to a product batch', async () => {
    const trackingCode = 'TRACK123-SET-' + (Math.random() * 100000).toFixed(0);
    const updateDto: UpdateTrackingCodeDTO = {
      id: productBatchId,
      trackingCode,
    };
    const res = await request(app)
      .put(BASE_PATH + '/secondary-producer/batch/code')
      .set(secondaryAuthHeader)
      .send(updateDto)
      .expect(200);
    expect(res.body.status).toBe(200);
  });

  it('should recycle a product batch', async () => {
    // First assign a tracking code
    const trackingCode =
      'TRACK123-RECYCLE-' + (Math.random() * 100000).toFixed(0);
    await request(app)
      .put(BASE_PATH + '/secondary-producer/batch/code')
      .set(secondaryAuthHeader)
      .send({ id: productBatchId, trackingCode })
      .expect(200);

    // Recycle the product batch
    const recycleDto: RecycleBaseBottlesDTO = {
      productBatchId,
      quantity: 5,
    };
    const recycleRes = await request(app)
      .put(BASE_PATH + '/secondary-producer/batch/recycle')
      .set(secondaryAuthHeader)
      .send(recycleDto)
      .expect(200);
    expect(recycleRes.body.status).toBe(200);
    expect(recycleRes.body.data).toHaveProperty('recyclingBatchId');
  });
  it('should sell a product batch (requires tracking code)', async () => {
    // Assign tracking code first
    const trackingCode = 'TRACK123-SELL-' + (Math.random() * 100000).toFixed(0);
    await request(app)
      .put(BASE_PATH + '/secondary-producer/batch/code')
      .set(secondaryAuthHeader)
      .send({ id: productBatchId, trackingCode })
      .expect(200);

    // Register buyer
    const buyerUser = {
      email: 'buyer@example.com',
      password: 'TestPassword123',
      roleId: ROLES.BUYER,
    };
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(buyerUser)
      .expect(201);

    // Vender lote
    const sellDto: SellProductBottlesDTO = {
      batchId: productBatchId,
      quantity: 10,
      buyerUid: 'buyer',
    };
    const sellRes = await request(app)
      .put(BASE_PATH + '/secondary-producer/batch/sell')
      .set(secondaryAuthHeader)
      .send(sellDto)
      .expect(200);
    expect(sellRes.body.status).toBe(200);
    expect(sellRes.body.data).toHaveProperty('soldProductId');
  });

  it('should get recycler product batches paginated', async () => {
    const res = await request(app)
      .get(BASE_PATH + '/secondary-producer/batches/user?page=1&limit=10')
      .set(secondaryAuthHeader)
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.length).toBeLessThanOrEqual(10);
  });
});
