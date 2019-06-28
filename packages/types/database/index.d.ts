import { IGWorker } from "../core/worker";

interface IGDatabase extends IGWorker {
}

interface IGDatabaseOptions {
    uri: string;
}

export { IGDatabase, IGDatabaseOptions };
