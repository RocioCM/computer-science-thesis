import { DataSource } from 'typeorm';

/** @description Database connection in memory for testing purposes. */
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: ['src/modules/**/domain/*.ts'],
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
