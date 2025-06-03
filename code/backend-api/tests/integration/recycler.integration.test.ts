import request from 'supertest';
import app from '../../src/internal/server';
import { BASE_PATH, ROLES } from 'src/pkg/constants';
import {
  setupBlockchainEnvironment,
  setupTestEnvironment,
  teardownTestEnvironment,
} from '../utils';
import {
  CreateRecyclingBatchDTO,
  SellRecyclingBatchDTO,
} from 'src/modules/recycler/domain/recycledMaterialBatch';

describe('Integration: Recycler', () => {
  // User variables
  const primaryUser = {
    email: 'primary-recycler@example.com',
    password: 'TestPassword123',
    roleId: ROLES.PRODUCER,
  };
  const primaryUid = 'primary-recycler';

  const recyclerUser = {
    email: 'recycler@example.com',
    password: 'TestPassword123',
    roleId: ROLES.RECYCLER,
  };
  const recyclerAuthHeader = {
    Authorization: 'Bearer userWithId-userRole-RECYCLER-recycler',
  };

  beforeAll(async () => {
    await setupTestEnvironment();
    await setupBlockchainEnvironment();

    // Create a primary producer user
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(primaryUser)
      .expect(201);

    // Create a recycler user
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(recyclerUser)
      .expect(201);
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  it('should create a recycling batch', async () => {
    const recyclingBatchDto: CreateRecyclingBatchDTO = {
      weight: 450,
      size: 'medium',
      materialType: 'vidrio',
      composition: [
        {
          name: 'vidrio',
          amount: 450,
          measureUnit: 'g',
        },
      ],
      extraInfo: 'High quality recycled material',
      wasteBottleIds: [], // In a real case, wasteBottleId would go here
    };

    const res = await request(app)
      .post(BASE_PATH + '/recycler/batch')
      .set(recyclerAuthHeader)
      .send(recyclingBatchDto)
      .expect(201);

    expect(res.body.data).toHaveProperty('batchId');
  });

  it('should sell a recycling batch', async () => {
    const recyclingBatchDto: CreateRecyclingBatchDTO = {
      weight: 450,
      size: 'medium',
      materialType: 'vidrio',
      composition: [
        {
          name: 'vidrio',
          amount: 450,
          measureUnit: 'g',
        },
      ],
      extraInfo: 'High quality recycled material',
      wasteBottleIds: [],
    };

    const createRes = await request(app)
      .post(BASE_PATH + '/recycler/batch')
      .set(recyclerAuthHeader)
      .send(recyclingBatchDto)
      .expect(201);
    const createdBatchId = createRes.body.data.batchId;

    // Sell the recycling batch to a primary producer
    const sellDto: SellRecyclingBatchDTO = {
      batchId: Number(createdBatchId),
      buyerUid: primaryUid, // Sell to the primary producer
    };

    const res = await request(app)
      .put(BASE_PATH + '/recycler/batch/sell')
      .set(recyclerAuthHeader)
      .send(sellDto)
      .expect(200);

    expect(res.body.status).toBe(200);
  });
});
