import { createClient } from 'redis';
import { checkEnvironmentVariables } from '../utils/environmentUtils';

const redisEnvironments: string[] = ['REDIS_URI'];

try {
  checkEnvironmentVariables(redisEnvironments);
} catch {
  throw new Error('REDIS_URI environment variable is not defined');
}

const redisClient = createClient({
  url: process.env.REDIS_URI,
});
redisClient.on('error', (error) => {
  console.error('Redis Client Error:', error);
});

(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log('Redis client is running');
    }
  } catch (error) {
    throw new Error('Failed to connect Redis: ' + error);
  }
})();

export default redisClient;
