import * as process from 'node:process';

export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  swapi: {
    base: process.env.SWAPI_BASE || '',
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    namespace: process.env.REDIS_NAMESPACE || 'swapi',
  },
});
