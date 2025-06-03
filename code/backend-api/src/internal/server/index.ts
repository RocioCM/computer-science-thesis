import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import cors from 'cors';
import apiMiddleware from './routes';
import { BASE_PATH } from 'src/pkg/constants';
import responseHelper from 'src/pkg/helpers/responseHelper';
import docsHelper from 'src/pkg/helpers/docsHelper';
import logger from 'src/pkg/helpers/logger';

const server = express();

// Initialize and configure Swagger documentation for endpoints.
docsHelper.initSwaggerDocs(server);

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
