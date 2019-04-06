import { IGWorker } from "../core/worker";

interface IGDatabase extends IGWorker {
    options: IGDatabaseOptions;
}

interface IGDatabaseOptions {
    uri: string;
}

export { IGDatabase, IGDatabaseOptions };