import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { DB_NAME } from 'src/pkg/constants';
import { getEnv, isProduction } from './env';

let DBSource: DataSource;

/** Initialize the database connection */
export function initializeDBSource() {
  // Determine the correct entities path based on environment
  const entitiesPath = isProduction()
    ? 'dist/src/modules/**/domain/*.js'
    : 'src/modules/**/domain/*.ts';

  // Configure and initialize the database connection using TypeORM.
  DBSource = new DataSource({
    type: 'mariadb',
    host: getEnv('DB_HOST', 'localhost'),
    port: Number(getEnv('DB_PORT', '3306')),
    username: getEnv('DB_USER'),
    password: getEnv('DB_PASS'),
    database: DB_NAME,
    synchronize: false,
    logging: false,
    entities: [entitiesPath],
    poolSize: 10,
    charset: 'utf8mb4',
  });
  return DBSource.initialize();
}

/**
 * @returns The initialized database connection.
 */
export function getDBSource() {
  return DBSource;
}

const databaseHelper = {
  initializeDBSource,
  db: getDBSource,
};

export default databaseHelper;
