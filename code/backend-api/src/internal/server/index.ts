import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import cors from 'cors';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import apiMiddleware from './routes';
import { BASE_PATH } from 'src/pkg/constants';
import responseHelper from 'src/pkg/helpers/responseHelper';
import logger from 'src/pkg/helpers/logger';
import path from 'path';

// Swagger configuration
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
  ], // Docs URL
  swaggerUIPath: BASE_PATH + '/api-docs',
  // Json docs URL
  apiDocsPath: BASE_PATH + '/api-docs.json',
  // This is the URL that will be used to access the API documentation
  baseURL: BASE_PATH,
  // Set server URL to include the BASE_PATH
  servers: [{ url: BASE_PATH, description: 'Current API server' }],
};

const server = express();

// Initialize Swagger
expressJSDocSwagger(server)(options);

// Configure express to parse JSON data in the request body
server.use(express.json());

// Configure CORS using "cors" library.
server.use(
  cors({
    origin: ['https://*', 'http://*'],
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Authorization',
      'Accept',
      'X-CSRF-Token',
    ],
    exposedHeaders: ['Link'],
    optionsSuccessStatus: 200,
    maxAge: 300,
  }),
);

// Mount the API router under the BASE_PATH.
server.use(BASE_PATH, apiMiddleware);

// 404 fallback response.
server.use('*', (_req: Request, res: Response) => {
  responseHelper.build(
    res,
    StatusCodes.NOT_FOUND,
    "Endpoint doesn't exist or method not allowed.",
  );
  return;
});

// Fallback error handler
server.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  // Handle uncaught errors.
  logger.debug('Error handler: ', err.message, err.stack);
  if (!res.headersSent) {
    responseHelper.build(res, StatusCodes.INTERNAL_SERVER_ERROR);
  } else {
    // If headers were already sent, then pass the error to the next handler.
    next(err);
  }
  return;
});

export default server;
