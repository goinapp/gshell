import { IGWorker } from "../core/worker";
import * as Redlock from 'redlock';

export interface IGRedis extends IGWorker {
  lock(resource: string, id: string, ttl: number): Promise<Redlock.Lock>;
}