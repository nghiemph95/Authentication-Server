import { getMockReq, getMockRes } from '@jest-mock/express';
import { MESSAGE } from '../../../../config/constant';
import { healthCheck } from './health.routes';
// import 'setimmediate';

describe('healthRouter', () => {
  const req = getMockReq();
  const { res, next, mockClear } = getMockRes();

  beforeEach(() => {
    mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('healthCheck()', () => {
    it('call success', async () => {
      await healthCheck()(req, res, next);
      expect(res.send).toHaveBeenCalledWith(MESSAGE.HEALTH_CHECK);
    });
  });
});
