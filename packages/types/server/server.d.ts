import { IGWorker } from "../core/worker";

interface IGServer extends IGWorker {
    options: IGServerOptions;    
}

interface IGServerOptions {
    port: number;
}

export { IGServer, IGServerOptions };