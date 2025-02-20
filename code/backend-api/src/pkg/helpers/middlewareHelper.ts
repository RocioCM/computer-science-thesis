import { Request, Response, NextFunction, Router } from 'express';
import logger from './logger';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

const wrapAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      logger.debug(err);
      next(err);
    });
  };
};

export function applyAsyncHandlerMiddleware(router: Router) {
  const methods = ['get', 'post', 'put', 'delete'] as const;

  methods.forEach((method) => {
    const originalMethod = router[method] as (...args: any[]) => Router;

    router[method] = ((path: string, ...handlers: AsyncHandler[]) => {
      const wrappedHandlers = handlers.map((handler) => wrapAsync(handler));
      return originalMethod.call(router, path, ...wrappedHandlers);
    }) as typeof originalMethod;
  });
}

const middlewareHelper = {
  applyAsyncHandlerMiddleware,
};

export default middlewareHelper;
