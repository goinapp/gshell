import { IGWorker } from "../core/worker";

interface IGMessageBroker extends IGWorker {
}

export interface IGMessageBrokerOptions {
  uri: string;
  reconnection_timeout?: number;
}

export interface IConsumer {
  queue: string;
  consumer: (obj: any) => Promise<void>;
  prefetch?: number;
}
