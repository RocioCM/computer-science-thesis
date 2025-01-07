import dotenv from 'dotenv';
import { getEnv } from 'src/pkg/helpers/env';
import { BASE_PATH, DB_NAME } from 'src/pkg/constants';
import logger from 'src/pkg/helpers/logger';
import server from 'src/internal/server';
import databaseHelper from 'src/pkg/helpers/databaseHelper';
import * as authHelper from 'src/pkg/helpers/authHelper';

async function main() {
  dotenv.config();
  const PORT = getEnv('PORT', '8080');

  // Start the server
  server.listen(PORT, () => {
    logger.info(
      `Application is running on: http://localhost:${PORT}/api${BASE_PATH}`,
    );
  });

  // Init database connection.
  databaseHelper
    .initializeDBSource()
    .then(() => {
      logger.info(`Successfully connected to ${DB_NAME} database.`);
    })
    .catch((error) => {
      logger.error('DB Connection ERROR -', error);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    });

  // Init Firebase Authentication Admin
  authHelper
    .initializeAdmin()
    .then(() => logger.info(`Successfully initialized Firebase Admin.`))
    .catch((error) => {
      logger.error('Firebase Admin Initialization Error -', error);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    });
}

main();
