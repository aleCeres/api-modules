import { Request, Response, NextFunction } from 'express';
import log from '../logger';
import { HttpCustomError } from '../errors/HttpCustomError';

/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param _next NextFunction function provided by Express
 */
function errorHandler(
  err: TypeError | HttpCustomError,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  let customError = err;

  if (!(err instanceof HttpCustomError)) {
    customError = new HttpCustomError(
      'unknown error',
    );
  }
  log.error({ customError });
  res.status((customError as HttpCustomError).status).send(customError);
}

export default errorHandler;
