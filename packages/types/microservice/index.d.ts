import { IGWorker } from "../core/worker";

export interface IGMicroservice {
  start(): Promise<void>;
  stop(): Promise<void>;
  service<T extends IGWorker>(service: string): T;
}
