import express from 'express';
import healthRouterV1 from './health/v1/health.routes';

const apiRouter = express.Router();

apiRouter.use('/v1/health', healthRouterV1);

export default apiRouter;
