import * as Redis from "ioredis";
import * as Redlock from "redlock";
import { GRedis } from '@gshell/types';


interface IRedisOptions {
  host: string;
  port: number;
  mock?: boolean;
}

class GoinRedis implements GRedis {
  public client?: Redis.Redis;
  private redlock?: Redlock;
  private readonly options: IRedisOptions;

  constructor(options: IRedisOptions) {
    this.options = options;
  }

  public async connect(): Promise<void> {
    try {
      this.client = new Redis(this.options.port, this.options.host);
      this.redlock = new Redlock([this.client]);
    } catch (err) {
      throw err;
    }
  }

  public async lock(resource: string, id: string, ttl = 1000): Promise<Redlock.Lock> {
    try {
      if (!this.redlock) {
        throw new GoinError("Lock was not initialized");
      }
      const lockId: string = !id ? `locks:${resource}` : `locks:${resource}:${id}`;
      const lock: Redlock.Lock = await this.redlock.lock(lockId, ttl);
      logger.info(`Locked resource ${lockId}`); // TODO: Change for Goin Logging
      return lock;
    } catch (err) {
      throw err;
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.client) {
        this.client.disconnect();
      }
    } catch (err) {
      throw err;
    }
  }
}

export {
  IRedisOptions,
  GoinRedis,
};
