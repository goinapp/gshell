export interface IGMicroservice {
  start(): Promise<void>;
  stop(): Promise<void>;
  service<T>(service: string): T;
}
