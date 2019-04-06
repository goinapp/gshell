import { Db, MongoClient } from "mongodb";
import { IGDatabase, IGDatabaseOptions } from "./database";

declare class GMongoDB implements IGDatabase {

    constructor(options: IGDatabaseOptions);

    private readonly client: MongoClient;

    readonly options: IGDatabaseOptions;

    up(): Promise<void>;
    down(): Promise<void>;

    getDb: (name?: string) => Db;
    
}

export { GMongoDB };