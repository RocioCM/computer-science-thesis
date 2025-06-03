import { DataSource } from 'typeorm';
import { ethers } from 'ethers';
import logger from 'src/pkg/helpers/logger';
import blockchainHelper from 'src/pkg/helpers/blockchainHelper';

/** @description Database connection in memory for testing purposes. */
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: ['src/modules/**/domain/*.ts'],
});

// Global nonce tracking to prevent "nonce too low" errors in integration tests.
let currentNonce: number | null = null;
let provider: ethers.JsonRpcProvider | null = null;
let wallet: ethers.Wallet | null = null;

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

  await resetNonce(); // Reset nonce to avoid conflicts in tests
}

/** Get next available nonce to avoid "nonce too low" errors */
export function getNextNonce(): number {
  if (currentNonce === null) {
    logger.error(
      'Nonce manager not initialized - call setupBlockchainEnvironment first',
    );
    return 0; // Fallback in case of error
  }
  return currentNonce++;
}

export async function setupBlockchainEnvironment() {
  // Initialize blockchain provider and wallet for tests

  if (!provider) {
    provider = new ethers.JsonRpcProvider(
      process.env.PROVIDER_URL || 'http://localhost:8545',
    );
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);

    // Get the current nonce for the wallet
    if (currentNonce === null) {
      await resetNonce();
    }
  }
}

/** Reset the nonce counter - useful between major test suites */
export async function resetNonce() {
  if (provider && wallet) {
    try {
      currentNonce = await provider.getTransactionCount(wallet.address);
      logger.info(`Reset nonce to: ${currentNonce}`);
    } catch (error) {
      logger.error('Failed to reset nonce:', error);
    }
  }
}

/** Call this method after all tests to teardown the test environment (DB and third parties services). */
export async function teardownTestEnvironment() {
  await AppDataSource.destroy(); // Close database connection
  await resetNonce(); // Reset nonce to avoid conflicts in tests
}
