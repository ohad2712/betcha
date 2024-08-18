import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const setCache = async (key: string, value: any, expire: number) => {
  await redis.set(key, JSON.stringify(value), 'EX', expire);
};

export const getCache = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};
