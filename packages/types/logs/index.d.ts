import { IGWorker } from "../core/worker";

export interface IGLogger extends IGWorker {
  error(message: string, err?: object, meta?: object): void;
  warn(message: string, meta?: object): void;
  info(message: string, meta?: object): void;
}

export interface IGWinstonOptions {
  resource: {
    labels: {
      cluster_name: string,
      container_name: string,
      namespace_name: string,
      pod_name: string,
      location: string,
    },
    type: string,
  }
}
