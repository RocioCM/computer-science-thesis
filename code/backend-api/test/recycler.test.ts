import request from 'supertest';
import app from '../src/internal/server';
import { BASE_PATH, ROLES } from '../src/pkg/constants';
import {
  setupTestEnvironment,
  cleanupTestDatabase,
  teardownTestEnvironment,
} from './utils';
import { StatusCodes } from 'http-status-codes';
import blockchainHelper from '../src/pkg/helpers/blockchainHelper';

describe('Recycler API', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  it('should get something', async () => {
    const batchId = 1;
    jest
      .spyOn(blockchainHelper, 'callPureContractMethod')
      .mockImplementation(async (methodName) => {
        if (methodName === 'recycledMaterials') {
          return {
            ok: true,
            status: StatusCodes.OK,
            data: {
              id: batchId,
              quantity: 100,
              bottleType: {
                weight: 500,
                color: 'green',
                thickness: 2,
                shapeType: 'round',
                originLocation: 'Argentina',
                extraInfo: 'Recycled glass',
                composition: [
                  { name: 'Glass', amount: 100, measureUnit: 'kg' },
                ],
              },
            },
          };
        } else if (methodName === 'getWasteBottleIdsForBatch') {
          return {
            ok: true,
            status: StatusCodes.OK,
            data: [1, 2, 3],
          };
        }
        return {
          ok: false,
          status: StatusCodes.NOT_FOUND,
          data: null,
        };
      });
  });
});
