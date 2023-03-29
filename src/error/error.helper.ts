import express from 'express';
import STATUS_CODE from 'http-status';
import ENV from '../config/env';
import logger from '../config/logger';
import { HttpException } from './error.const';

export function exceptionHandler(
  err: HttpException | Error,
  req: express.Request,
  res: express.Response,
) {
  const errorMessage = err.toString();

  /** for test mode: no further action, just local log only */
  if (ENV.APP.ENV !== 'test') {
    const message = [
      `[${new Date().toISOString()}]`,
      req.baseUrl + req.path,
      '-',
      errorMessage,
      '-',
    ].join(' ');

    logger.warn(message);

    /** send response to client-side (FE) */
    if (err instanceof HttpException)
      res.status(err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR).send(errorMessage);
    else res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send(errorMessage);
  }
}
