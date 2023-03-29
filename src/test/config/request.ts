import supertest from 'supertest';
import app from '../../config/express';

const request = supertest(app);

export default request;
