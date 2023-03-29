import config from 'config';

const ENV = {
  APP: {
    ENV: config.get<string>('app.env'),
    NAME: config.get<string>('app.name'),
    DESCRIPTION: config.get<string>('app.description'),
    VERSION: config.get<string>('app.version'),
    BASE_URL: config.get<string>('app.baseUrl'),
  },
  SERVER: {
    HOST: config.get<string>('server.host'),
    PORT:
      config.get<string>('app.env') === 'test'
        ? Math.floor(Math.random() * 100) + 1
        : config.get<number>('server.port'),
    PROTOCOL: config.get<string>('server.protocol'),
  },
};

export default ENV;
