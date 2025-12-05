import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL ?? {
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DB ?? 0),
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  reconnectOnError: (err) => err.message.includes('READONLY'),
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});
redis.on('connect', () => console.info('Redis connected'));

export default redis;