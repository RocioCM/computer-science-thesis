import request from 'supertest';
import app from '../../src/internal/server';
import { BASE_PATH, ROLES } from 'src/pkg/constants';
import {
  setupBlockchainEnvironment,
  setupTestEnvironment,
  teardownTestEnvironment,
} from '../utils';
import { CreateWasteBottleDTO } from 'src/modules/consumer/domain/wasteBottle';

describe('Integration: Consumer', () => {
  let trackingCode: string;
  let consumerUid: string;
  let consumerAuthHeader: any;

  beforeAll(async () => {
    await setupTestEnvironment();
    await setupBlockchainEnvironment();
    // Register primary producer
    const primaryUser = {
      email: 'primary@example.com',
      password: 'TestPassword123',
      roleId: ROLES.PRODUCER,
    };
    const primaryAuthHeader = {
      Authorization: 'Bearer userWithId-userRole-PRODUCER-primary',
    };
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(primaryUser)
      .expect(201); // Create base batch
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
    const baseBatchId = createBatchRes.body.data.batchId; // Register secondary producer
    const secondaryUser = {
      email: 'secondary@example.com',
      password: 'TestPassword123',
      roleId: ROLES.SECONDARY_PRODUCER,
    };
    const secondaryAuthHeader = {
      Authorization: 'Bearer userWithId-userRole-SECONDARY_PRODUCER-secondary',
    };
    const secondaryUid = 'secondary';
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(secondaryUser)
      .expect(201); // Sell base batch to secondary producer
    const sellData = {
      batchId: Number(baseBatchId),
      quantity: 50,
      buyerUid: secondaryUid,
    };
    const sellRes = await request(app)
      .put(BASE_PATH + '/producer/batch/sell')
      .set(primaryAuthHeader)
      .send(sellData)
      .expect(200);
    const productBatchId = sellRes.body.data.productBatchId;

    // Assign tracking code
    trackingCode = 'TRACK123-CONSUMER-' + (Math.random() * 10000).toFixed(0);
    await request(app)
      .put(BASE_PATH + '/secondary-producer/batch/code')
      .set(secondaryAuthHeader)
      .send({ id: productBatchId, trackingCode })
      .expect(200); // Register buyer
    const buyerUser = {
      email: 'buyer@example.com',
      password: 'TestPassword123',
      roleId: ROLES.BUYER,
    };
    const buyerUid = 'buyer';
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(buyerUser)
      .expect(201);

    // Sell product batch to the buyer
    const sellProductData = {
      batchId: productBatchId,
      quantity: 10,
      buyerUid,
    };
    await request(app)
      .put(BASE_PATH + '/secondary-producer/batch/sell')
      .set(secondaryAuthHeader)
      .send(sellProductData)
      .expect(200); // Register consumer
    const consumerUser = {
      email: 'consumer@example.com',
      password: 'TestPassword123',
      roleId: ROLES.CONSUMER,
    };
    consumerUid = 'consumer';
    consumerAuthHeader = {
      Authorization: 'Bearer userWithId-userRole-CONSUMER-consumer',
    };
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(consumerUser)
      .expect(201);
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });
  it('should get the product origin by tracking code', async () => {
    const res = await request(app)
      .get(BASE_PATH + `/consumer/origin/${trackingCode}`)
      .set(consumerAuthHeader)
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    expect(res.body.data[1].data.trackingCode).toBe(trackingCode);
  });
  it('should create a waste bottle', async () => {
    const wasteBottleDto: CreateWasteBottleDTO = {
      trackingCode,
      owner: consumerUid,
    };
    const res = await request(app)
      .post(BASE_PATH + '/consumer/waste')
      .set(consumerAuthHeader)
      .send(wasteBottleDto)
      .expect(201);
    expect(res.body.data).toHaveProperty('bottleId');
  });

  it('should get paginated user waste bottles', async () => {
    // Create waste bottle first
    const wasteBottleDto: CreateWasteBottleDTO = {
      trackingCode,
      owner: consumerUid,
    };
    await request(app)
      .post(BASE_PATH + '/consumer/waste')
      .set(consumerAuthHeader)
      .send(wasteBottleDto)
      .expect(201);
    // Query all waste bottles
    const res = await request(app)
      .get(BASE_PATH + '/consumer/waste?page=1&limit=5')
      .set(consumerAuthHeader)
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
  });
});
