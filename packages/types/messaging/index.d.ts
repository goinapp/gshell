
export interface IRabbitOptions {
  uri: string;
  reconnection_timeout?: number;
}

export interface IConsumer {
  queue: string;
  consumer: (obj: any) => Promise<void>;
  prefetch?: number;
}
