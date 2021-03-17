import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { default as IORedis, Redis } from 'ioredis';
import { REDIS_KEY, REDIS_OPTIONS } from '../constants';
import { RedisOptions } from '../types';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private redis: Redis;
  constructor(
    @Inject(REDIS_OPTIONS)
    private readonly options: RedisOptions,
  ) {
    this.redis = new IORedis(this.options);
  }

  get instance() {
    return this.redis;
  }

  async onModuleDestroy() {
    this.redis.disconnect();
  }

  async get(key: string): Promise<string | Record<string, unknown>> {
    return this.redis.get(`${REDIS_KEY}.${key}`);
  }

  async set(key: string, payload: string | Buffer | number | any[]) {
    return this.redis.set(`${REDIS_KEY}.${key}`, payload);
  }

  async flush() {
    return this.redis.flushall();
  }
}
