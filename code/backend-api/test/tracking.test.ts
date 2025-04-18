import request from 'supertest';
import app from '../src/internal/server';
import { BASE_PATH, ROLES } from '../src/pkg/constants';
import {
  setupTestEnvironment,
  cleanupTestDatabase,
  teardownTestEnvironment,
} from './utils';

describe('Tracking API', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  it('should get something', async () => {});
});
