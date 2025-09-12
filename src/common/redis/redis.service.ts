import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  private readonly TTL = {
    USER: 60 * 10,
    USERS: 60 * 5,
    // BOOKING: 60 * 30,
    // STORE: 60 * 60,
    SESSION: 60 * 60 * 24 * 7,
    REFRESH_TOKEN: 60 * 60 * 24 * 7,
  };

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string) {
    return this.client.del(key);
  }

  async setWithType(key: string, value: string, type: keyof typeof this.TTL) {
    await this.client.set(key, value, 'EX', this.TTL[type]);
  }

  async flushPrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }
}
