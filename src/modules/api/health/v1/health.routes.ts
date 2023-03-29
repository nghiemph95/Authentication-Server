import express from 'express';
import httpStatus from 'http-status';
import { MESSAGE } from '../../../../config/constant';

const healthRouter = express.Router();

healthRouter.get('/check', healthCheck());

export default healthRouter;

/** ================================================================================== */
/**
 * functions
 * */

export function healthCheck() {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      res.status(httpStatus.OK).send(MESSAGE.HEALTH_CHECK);
    } catch (err) {
      next(err);
    }
  };
}
