import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { HttpException } from '../error/error.const';
import { exceptionHandler } from '../error/error.helper';
import apiRouter from '../modules/api/api.routes';
import authRouter from '../modules/api/auth/auth.routes';

const app = express();

loadLogs();
loadConfigs();
loadRoutes();
loadViews();
loadError();

export default app;

/** ================================================================================== */
/**
 * functions
 * */

function loadLogs() {
  app.use(
    morgan((tokens, req, res) => {
      const message = [
        `[${tokens.date(req, res, 'clf')}]`,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        '-',
        tokens['remote-addr'](req, res),
        '-',
        tokens['user-agent'](req, res),
        '-',
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');
      return message;
    }),
  );
}

function loadConfigs() {
  app.use(
    helmet({ contentSecurityPolicy: false }),
  ); /** secure app by setting various HTTP headers */
  app.use(compression()); /** compress HTTP responses. */
  app.use(cookieParser()); /** for parsing cookies */
  app.use(express.json()); /** for parsing application/json */
  app.use(
    express.urlencoded({ extended: true }),
  ); /** for parsing application/x-www-form-urlencoded */
}

function loadRoutes() {
  app.use('/api', apiRouter);

  app.use('/', authRouter);
}

function loadViews() {
  const assetsPath = path.join(__dirname, '../../assets');
  const buildPath = path.join(__dirname, '../../build');

  /** Serve local images */
  const imagePath = `${assetsPath}/images`;
  if (fs.existsSync(assetsPath) && fs.existsSync(imagePath)) {
    app.use(express.static(imagePath));
    app.get('/images/*', (req, res) => res.sendFile(`${imagePath}/${req.path}`));
  }

  /** Serve FE resources */
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
    app.get('/*', (_req, res) => res.sendFile(`${buildPath}/index.html`));
  } else if (fs.existsSync(assetsPath)) {
    app.use(express.static(assetsPath));
    app.get('/*', (_req, res) => res.sendFile(`${assetsPath}/index.html`));
  }
}

function loadError() {
  app.use(
    (
      err: HttpException | Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (res.headersSent) next(err);
      else exceptionHandler(err, req, res);
    },
  );
}
