import bcrypt from 'bcryptjs';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import fs from 'fs';
import { LOCAL_HOSTS } from './constant';
import ENV from './env';
import logger from './logger';
import jwt from 'jsonwebtoken';

export function getFilesizeInBytes(filename: string) {
  try {
    const stats = fs.statSync(filename);
    const fileSizeInBytes = stats['size'];
    return fileSizeInBytes / 1000000;
  } catch (err) {
    return 0;
  }
}

export async function inputValidator<T>(input: T, metatype: ClassConstructor<T>) {
  const object: any = plainToInstance(metatype, input);
  const errors = await validate(object, {
    forbidUnknownValues: true,
    validationError: { target: false, value: false },
  });
  if (errors.length)
    throw errors
      .map((error) => !!error.constraints && Object.values(error.constraints).join(', '))
      .join(', ');
}

export function getServerHostName() {
  if (LOCAL_HOSTS.includes(ENV.SERVER.HOST))
    return `${ENV.SERVER.PROTOCOL}://${ENV.SERVER.HOST}:${ENV.SERVER.PORT}`;
  return `${ENV.SERVER.PROTOCOL}://${ENV.SERVER.HOST}`;
}

export function encodePassword(myPlaintextPassword: string, saltRounds = 10) {
  return new Promise<string>((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        logger.error(`genSalt: ${err.toString()}`);
        reject(err);
      } else
        bcrypt.hash(myPlaintextPassword, salt, (err, hash) => {
          if (err) {
            logger.error(`genSaltV2: ${err.toString()}`);
            reject(err);
          } else resolve(hash);
        });
    });
  });
}

export function validatePassword(rawPassword: string, hashPassword: string) {
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(rawPassword, hashPassword, (err, res) => {
      if (err) {
        logger.error(`genSalt: ${err.toString()}`);
        reject(err);
      } else resolve(res);
    });
  });
}

export function getAccessToken(payload: any) {
  return jwt.sign(payload, 'secret', { expiresIn: '1h' });
}

export function getRefreshToken(payload: any) {
  return jwt.sign(payload, 'secret', { expiresIn: '30d' });
}

export function getExpireDateFromToken(token: string) {
  const data = jwt.decode(token, { complete: true });
  const expireTime = (data?.payload as jwt.JwtPayload).exp;
  const expireDate = new Date(0);

  if (expireTime) expireDate.setUTCSeconds(expireTime);
  return expireDate.toISOString();
}

export function getInfoFromToken(token: string) {
  const info = jwt.decode(token);
  const tokenEncode = info as jwt.JwtPayload;

  return tokenEncode;
}
