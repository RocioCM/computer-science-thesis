import request from 'supertest';
import app from '../../src/internal/server';
import { BASE_PATH, ROLES } from 'src/pkg/constants';
import {
  setupBlockchainEnvironment,
  setupTestEnvironment,
  teardownTestEnvironment,
} from '../utils';
import {
  RecycleBaseBottlesDTO,
  SellBaseBottlesDTO,
} from 'src/modules/producer/domain/baseBatch';

describe('Integration: Producer', () => {
  beforeAll(async () => {
    await setupBlockchainEnvironment();
  });

  beforeEach(async () => {
    await setupTestEnvironment();
  });

  afterEach(async () => {
    await teardownTestEnvironment();
  });

  const producerUser = {
    email: 'producer@example.com',
    password: 'TestPassword123',
    roleId: ROLES.PRODUCER,
  };
  const producerAuthHeader = {
    Authorization: 'Bearer userWithId-userRole-PRODUCER-producer',
  };

  const secondaryProducerUser = {
    email: 'secprod@example.com',
    password: 'TestPassword123',
    roleId: ROLES.SECONDARY_PRODUCER,
  };
  const secondaryProducerUid = 'secprod';
  // Helper to register producer user
  async function registerProducer() {
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(producerUser)
      .expect(201);
  }

  // Helper to register secondary producer user
  async function registerSecondaryProducer() {
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(secondaryProducerUser)
      .expect(201);
  }
  // 1. Create base bottle batch
  it('should create a base bottle batch', async () => {
    await registerProducer();
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
    const res = await request(app)
      .post(BASE_PATH + '/producer/batch')
      .set(producerAuthHeader)
      .send(batchData)
      .expect(201);
    expect(res.body.data).toHaveProperty('batchId');
  });
  // 2. Query batch by ID
  it('should query a batch by ID', async () => {
    await registerProducer();
    const batchData = {
      quantity: 50,
      bottleType: {
        weight: 400,
        color: 'amber',
        thickness: 3,
        shapeType: 'oval',
        originLocation: 'Chile',
        extraInfo: 'Glass',
        composition: [],
      },
      createdAt: new Date('2025-01-01').toISOString(),
    };
    const createRes = await request(app)
      .post(BASE_PATH + '/producer/batch')
      .set(producerAuthHeader)
      .send(batchData)
      .expect(201);
    const batchId = createRes.body.data.batchId;
    const getRes = await request(app)
      .get(BASE_PATH + `/producer/batch/${batchId}`)
      .set(producerAuthHeader)
      .expect(200);
    expect(getRes.body.data.id).toBe(batchId);
    expect(getRes.body.data.bottleType.color).toBe(batchData.bottleType.color);
  });
  // 3. List user's batches
  it("should list the user's batches with pagination", async () => {
    await registerProducer();
    // Create multiple batches
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post(BASE_PATH + '/producer/batch')
        .set(producerAuthHeader)
        .send({
          quantity: 10 + i,
          bottleType: {
            weight: 300 + i * 10,
            color: 'blue',
            thickness: 1,
            shapeType: 'square',
            originLocation: 'Brasil',
            extraInfo: '',
            composition: [],
          },
          createdAt: new Date('2025-01-01').toISOString(),
        })
        .expect(201);
    }
    const res = await request(app)
      .get(BASE_PATH + '/producer/batches/user?page=1&limit=2')
      .set(producerAuthHeader)
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
  });
  // 4. Sell batch
  it('should sell a base bottle batch', async () => {
    await registerProducer();
    await registerSecondaryProducer();
    const batchData = {
      quantity: 20,
      bottleType: {
        weight: 350,
        color: 'clear',
        thickness: 2,
        shapeType: 'rectangular',
        originLocation: 'Uruguay',
        extraInfo: '',
        composition: [],
      },
      createdAt: new Date('2025-01-01').toISOString(),
    };
    const createRes = await request(app)
      .post(BASE_PATH + '/producer/batch')
      .set(producerAuthHeader)
      .send(batchData)
      .expect(201);
    const batchId = createRes.body.data.batchId;
    const sellData: SellBaseBottlesDTO = {
      batchId: Number(batchId),
      quantity: 5,
      buyerUid: secondaryProducerUid,
    };
    const sellRes = await request(app)
      .put(BASE_PATH + '/producer/batch/sell')
      .set(producerAuthHeader)
      .send(sellData)
      .expect(200);
    expect(sellRes.body.status).toBe(200); // Query batch to verify update
    const getRes = await request(app)
      .get(BASE_PATH + `/producer/batch/${batchId}`)
      .set(producerAuthHeader)
      .expect(200);
    expect(getRes.body.data.soldQuantity).toBeGreaterThanOrEqual(5);
  });
  // 5. Recycle batch
  it('should recycle a base bottle batch', async () => {
    await registerProducer();
    const batchData = {
      quantity: 15,
      bottleType: {
        weight: 320,
        color: 'brown',
        thickness: 3,
        shapeType: 'hexagonal',
        originLocation: 'Paraguay',
        extraInfo: '',
        composition: [],
      },
      createdAt: new Date('2025-01-01').toISOString(),
    };
    const createRes = await request(app)
      .post(BASE_PATH + '/producer/batch')
      .set(producerAuthHeader)
      .send(batchData)
      .expect(201);
    const batchId = createRes.body.data.batchId;
    const recycleData: RecycleBaseBottlesDTO = {
      batchId,
      quantity: 10,
    };
    const recycleRes = await request(app)
      .put(BASE_PATH + '/producer/batch/recycle')
      .set(producerAuthHeader)
      .send(recycleData)
      .expect(200);
    expect(recycleRes.body.status).toBe(200); // Query batch to verify update
    const getRes = await request(app)
      .get(BASE_PATH + `/producer/batch/${batchId}`)
      .set(producerAuthHeader)
      .expect(200);
    expect(getRes.body.data.quantity).toBeLessThanOrEqual(10);
  });
  // 6. Query recycled batches
  it("should list the user's recycled batches", async () => {
    await registerProducer();
    // Create and recycle a batch
    const batchData = {
      quantity: 12,
      bottleType: {
        weight: 310,
        color: 'yellow',
        thickness: 3,
        shapeType: 'triangle',
        originLocation: 'Bolivia',
        extraInfo: '',
        composition: [],
      },
      createdAt: new Date('2025-01-01').toISOString(),
    };
    const createRes = await request(app)
      .post(BASE_PATH + '/producer/batch')
      .set(producerAuthHeader)
      .send(batchData)
      .expect(201);
    const batchId = createRes.body.data.batchId;
    const recycleData: RecycleBaseBottlesDTO = {
      batchId: Number(batchId),
      quantity: 8,
    };
    await request(app)
      .put(BASE_PATH + '/producer/batch/recycle')
      .set(producerAuthHeader)
      .send(recycleData)
      .expect(200);
    // Query recycled batches
    const res = await request(app)
      .get(BASE_PATH + '/producer/recycled-batches')
      .set(producerAuthHeader)
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});
