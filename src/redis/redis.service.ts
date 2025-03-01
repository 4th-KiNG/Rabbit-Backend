import { Injectable } from "@nestjs/common";
import { createClient, RedisClientType } from "@redis/client";
@Injectable()
export class RedisService {
  private client: RedisClientType;
  constructor() {
    this.client = createClient();
    this.client.connect().catch(console.error);
  }

  async set(key: string, value: any, ttl: number) {
    await this.client.set(key, JSON.stringify(value), { EX: ttl });
  }

  async get(key: string) {
    const value = await this.client.get(key);
    return value;
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
