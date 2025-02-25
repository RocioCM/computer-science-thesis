import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import blockchainHelper from '../src/pkg/helpers/blockchainHelper';

// Load test environment variables
dotenv.config({ path: '.env.test' });

/** @description Database connection in memory for testing purposes. */
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: ['src/modules/**/domain/*.ts'],
});

// Mock blockchain helper functions
jest.spyOn(blockchainHelper, 'callContractMethod').mockResolvedValue({
  ok: true,
  status: StatusCodes.OK,
  data: [],
});
jest.spyOn(blockchainHelper, 'callPureContractMethod').mockResolvedValue({
  ok: true,
  status: StatusCodes.OK,
  data: {},
});

/** Call this method before all tests to setup the test environment (DB and third parties services) for the first time. */
export async function setupTestEnvironment() {
  await AppDataSource.initialize(); // Initialize test database
}

/** Call this method before each test to cleanup the database. */
export async function cleanupTestDatabase() {
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.clear(); // Ensures a clean state without dropping the schema
  }
}

/** Call this method after all tests to teardown the test environment (DB and third parties services). */
export async function teardownTestEnvironment() {
  await AppDataSource.destroy(); // Close database connection
}
