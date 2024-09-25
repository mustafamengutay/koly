import { RedisClientType, createClient } from 'redis';
import { checkEnvironmentVariables } from '../utils/environmentUtils';

const redisEnvironments: string[] = ['REDIS_URI'];

/**
 * @description RedisClient class is used to create a single Redis Client instance.
 * After getting the instance, it should be connected to the Redis Server via `.connect()`
 * method.
 */
class RedisClient {
  private static instance: RedisClientType;

  private constructor() {}

  public static getInstance(): RedisClientType {
    if (!RedisClient.instance) {
      try {
        checkEnvironmentVariables(redisEnvironments);
        RedisClient.instance = createClient({ url: process.env.REDIS_URI });
      } catch (error) {
        throw new Error('Failed to create Redis Client instance: ' + error);
      }
    }
    return RedisClient.instance;
  }
}

const redisClient = RedisClient.getInstance();
console.log('Redis is running');

export default redisClient;
