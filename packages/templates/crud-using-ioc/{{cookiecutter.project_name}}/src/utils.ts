import { IGWorker } from "@gshell/types/core/worker";

interface IGMicroservice {
  workers: IGWorker[];
  start(): Promise<void>;
  stop(): Promise<void>;
}

export class GMicroservice implements IGMicroservice {
  public readonly workers: IGWorker[];

  constructor(workers?: IGWorker[]) {
    this.workers = workers || [];
  }

  public start = async (): Promise<void> => {
    const inits = this.workers.map((worker) => {
      return worker.up();
    });
    await Promise.all(inits);
  };

  public stop = async (): Promise<void> => {
    const inits = this.workers.map((worker) => {
      return worker.down();
    });
    await Promise.all(inits);
  };
}
