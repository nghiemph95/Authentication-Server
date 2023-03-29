import { server } from '../../main';

afterAll(() => {
  server.close();
});
