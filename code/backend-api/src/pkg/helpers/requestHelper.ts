import { Request } from 'express';
import logger from './logger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { User } from 'src/modules/auth/domain/user';
import { IResult } from '../interfaces/result';
import { StatusCodes } from 'http-status-codes';

/**
 * Gets the authorization token from the request.
 * @param {Request} req The request object.
 * @returns {string} The authorization token.
 */
function getAuthToken(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
    return authHeader.split(' ')[1];
  }
  return authHeader ?? '';
}

async function parseBody<T extends object>(
  obj: any,
  classType: { new (...args: any[]): T },
): IResult<T> {
  // Convert plain object to class instance
  const instance = plainToInstance(classType, obj, {
    exposeDefaultValues: true,
    excludeExtraneousValues: true,
  });

  // Validate the instance using class-validator decorators
  const errors = await validate(instance);

  // Check if there are validation errors
  if (errors.length > 0) {
    const messages = errors
      .map(
        (error) =>
          `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`,
      )
      .join('; ');
    logger.debug(`Validation errors: ${messages}`);
    return { ok: false, status: StatusCodes.BAD_REQUEST, data: messages };
  }

  // Return the instance if there are no validation errors
  return { ok: true, status: StatusCodes.OK, data: instance };
}

/** @description Helper methods for HTTP requests handling, validation and use. */
const requestHelper = {
  getAuthToken,
  parseBody,
};

export default requestHelper;
