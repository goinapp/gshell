import * as Redis from "ioredis";
import * as Redlock from "redlock";
import { IGRedis } from "@gshell/types";


interface IGRedisOptions {
  host: string;
  port: number;
  mock?: boolean;
}

class GRedis implements IGRedis {
  public client?: Redis.Redis;
  private redlock?: Redlock;
  private readonly options: IGRedisOptions;

  constructor(options: IGRedisOptions) {
    this.options = options;
  }

  public async up(): Promise<void> {
    try {
      this.client = new Redis(this.options.port, this.options.host);
      this.redlock = new Redlock([this.client]);
    } catch (err) {
      throw err;
    }
  }

  public async lock(resource: string, id: string, ttl = 1000): Promise<Redlock.Lock> {
    if (!this.redlock) {
      throw new GoinError("Lock was not initialized");
    }
    const lockId: string = !id ? `locks:${resource}` : `locks:${resource}:${id}`;
    const lock: Redlock.Lock = await this.redlock.lock(lockId, ttl);
    return lock;
  }

  public async down(): Promise<void> {
    if (this.client) {
      this.client.disconnect();
    }
  }
}

export {
  IGRedisOptions as IRedisOptions,
  GRedis,
};
