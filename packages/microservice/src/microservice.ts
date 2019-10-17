import { IGWorker, IGMicroservice } from "@gshell/types";
import GError from "@gshell/gerror";

export interface IGMicroserviceOptions {
  [key: string]: IGWorker;
}

export class GMicroservice implements IGMicroservice {

  private readonly services: IGMicroserviceOptions;

  constructor(services: IGMicroserviceOptions) {
    this.services = services;
  }

  public async start() {
    await Promise.all(
      Object.keys(this.services).map(async (service) => {
        await this.services[service].up();
      }),
    );
  }

  public async stop() {
    await Promise.all(
      Object.keys(this.services).map(async (service) => {
        await this.services[service].down();
      }),
    );
  }

  public service<T extends IGWorker>(service: string): T {
    const serv = this.services[service];
    if (!serv) {
      throw new GError(service + " service not found", 404);
    }
    return serv as T;
  }
}
