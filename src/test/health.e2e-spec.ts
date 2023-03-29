import httpStatus from 'http-status';
import { MESSAGE } from '../config/constant';
import request from './config/request';

describe('health API', () => {
  describe('[GET] /api/health/check', () => {
    describe('v1', () => {
      it('login successfully', (done) => {
        request
          .get('/api/v1/health/check')
          .then((res) => {
            expect(res.status).toEqual(httpStatus.OK);
            expect(res.text).toEqual(MESSAGE.HEALTH_CHECK);
            done();
          })
          .catch((err) => done(err));
      });
    });
  });
});
