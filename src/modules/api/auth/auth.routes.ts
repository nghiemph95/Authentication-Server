import express from 'express';
import httpStatus from 'http-status';
import { pick } from 'lodash';
import {
  encodePassword,
  getAccessToken,
  getExpireDateFromToken,
  getInfoFromToken,
  getRefreshToken,
  validatePassword,
} from '../../../config/helper';
import { HttpException } from '../../../error/error.const';
import { database } from '../../knex';
import { IRefreshToken, ISignIn, ISignOut, ISignUp } from './auth.interface';

const authRouter = express.Router();

authRouter.post('/sign-up', signUp());
authRouter.post('/sign-in', signIn());
authRouter.post('/sign-out', signOut());
authRouter.post('/refresh-token', refreshToken());

export default authRouter;

function signUp() {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const body: ISignUp = req.body;

      const encodedPassword = await encodePassword(body.password);

      const payload = { ...body, password: encodedPassword };

      const userIds = await database('users').insert(payload);
      const user = await database('users')
        .where('id', userIds[0])
        .first('id', 'firstName', 'lastName', 'email');

      res.status(httpStatus.CREATED).send({
        ...user,
        displayName: `${body.firstName} ${body.lastName}`,
      });
    } catch (err) {
      next(err);
    }
  };
}

function signIn() {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const body: ISignIn = req.body;

      const user = await database('users')
        .where('email', body.email)
        .first('id', 'firstName', 'lastName', 'email', 'password');

      if (!user?.email)
        throw new HttpException({ statusCode: httpStatus.BAD_REQUEST, message: 'USER NOT FOUND' });

      const isValidUser = await validatePassword(body.password, user.password);

      if (!isValidUser)
        throw new HttpException({
          statusCode: httpStatus.BAD_REQUEST,
          message: 'PASSWORD INCORREC4T',
        });

      const payload = {
        ...pick(user, 'firstName', 'lastName', 'email'),
        displayName: `${user.firstName} ${user.lastName}`,
      };

      const accessToken = getAccessToken(payload);
      const refreshToken = getRefreshToken({ email: user.email });

      const token = await database('tokens').where('userId', user.id).first('id');
      const expireDate = getExpireDateFromToken(refreshToken);

      if (token)
        await database('tokens')
          .where('id', token.id)
          .update({ refreshToken, expiresIn: expireDate });
      else
        await database('tokens').insert({ userId: user.id, refreshToken, expiresIn: expireDate });

      res.status(httpStatus.CREATED).send({ ...payload, accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  };
}

function signOut() {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const body: ISignOut = req.body;

      const user = await database('users').where('id', body.id).first('id');

      if (!user?.id)
        throw new HttpException({
          statusCode: httpStatus.BAD_REQUEST,
          message: 'USER NOT FOUND',
        });

      const token = await database('tokens').where('userId', user.id).first('id');

      if (token) await database('tokens').where('userId', user.id).delete();

      res.status(httpStatus.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  };
}

function refreshToken() {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const body: IRefreshToken = req.body;

      const info = getInfoFromToken(body.refreshToken);

      const user = await database('users')
        .where('email', info.email)
        .first('id', 'firstName', 'lastName', 'email', 'password');

      const accessToken = getAccessToken({ user });

      const refreshTokenCheck = await database('tokens')
        .where('userId', user.id)
        .first('refreshToken');
      if (!refreshTokenCheck)
        res.status(400).send('The supplied refreshToken in the inbound does not exist');

      const refreshToken = getRefreshToken({ email: user.email });

      const token = await database('tokens').where('userId', user.id).first('id');
      if (token) {
        await database('tokens').where('id', token.id).update({ refreshToken });
      }

      res.status(200).send({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  };
}
