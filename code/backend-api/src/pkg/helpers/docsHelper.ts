import expressJSDocSwagger from 'express-jsdoc-swagger';
import swaggerUI from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';
import { Express } from 'express';
import { isProduction } from './env';
import logger from './logger';
import { BASE_PATH } from '../constants';

/**
 * Initializes Swagger documentation for the API.
 * In production, it loads a pre-generated Swagger JSON file.
 * In development, it generates Swagger documentation dynamically.
 *
 * @param server - The Express server instance
 */
export function initSwaggerDocs(server: Express): void {
  if (isProduction()) {
    // In production, load pre-generated Swagger JSON file
    try {
      const swaggerJsonPath = path.join(
        process.cwd(),
        'public',
        'swagger.json',
      );
      if (fs.existsSync(swaggerJsonPath)) {
        const swaggerDocument = JSON.parse(
          fs.readFileSync(swaggerJsonPath, 'utf8'),
        );
        server.use(
          `${BASE_PATH}/api-docs`,
          swaggerUI.serve,
          swaggerUI.setup(swaggerDocument),
        );
        server.get(`${BASE_PATH}/api-docs.json`, (req, res) => {
          res.json(swaggerDocument);
        });
        logger.info('Swagger documentation loaded from pre-generated file');
      } else {
        logger.error(`Swagger JSON file not found at ${swaggerJsonPath}`);
        server.use(`${BASE_PATH}/api-docs`, (req, res) => {
          res
            .status(404)
            .send(
              'API documentation not available in production. Run generate-swagger script during build.',
            );
        });
      }
    } catch (error) {
      logger.error('Failed to load Swagger documentation:', error);
    }
  } else {
    // In development, generate Swagger documentation dynamically
    const options = {
      info: {
        version: '1.0.0',
        title: 'Sistema de Trazabilidad de Botellas API',
        description:
          'API para el seguimiento del ciclo de vida de botellas de vidrio en blockchain',
        contact: {
          name: 'UNCuyo LCC',
        },
      },
      security: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      baseDir: path.join(__dirname, '../..'),
      // File patterns to search for JSDoc comments - include swagger-schemas.ts
      filesPattern: [
        './modules/**/*Router.ts',
        './modules/**/domain/*.ts',
        './modules/**/domain/swaggerSchemas.ts',
        './pkg/interfaces/swaggerSchemas.ts',
      ],
      // Docs URL
      swaggerUIPath: BASE_PATH + '/api-docs',
      // Json docs URL
      apiDocsPath: BASE_PATH + '/api-docs.json',
      // This is the URL that will be used to access the API documentation
      baseURL: BASE_PATH,
      // Set server URL to include the BASE_PATH
      servers: [{ url: BASE_PATH, description: 'Current API server' }],
    };

    // Initialize express-jsdoc-swagger dinamically
    expressJSDocSwagger(server)(options);
    logger.info('Dynamic Swagger documentation enabled for development');
  }
}

const docsHelper = {
  initSwaggerDocs,
};

export default docsHelper;
