import { IGDatabase, IGDatabaseOptions } from "@gshell/types";
import { Db, MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

export interface IGMongoDBOptions extends IGDatabaseOptions {
  name: string;
  mock?: boolean;
}

export default class GMongoDB implements IGDatabase {

  public readonly options: IGMongoDBOptions;
  private client?: MongoClient;
  private mockServer?: MongoMemoryServer;

  constructor(options: IGMongoDBOptions) {
    this.options = options;
  }

  public async up() {
    try {
      if (!this.options.mock) {
        this.client = await MongoClient.connect(this.options.uri, { useNewUrlParser: true });
      } else {
        this.mockServer = new MongoMemoryServer();
        const mongoUri = await this.mockServer.getConnectionString();
        this.client = await MongoClient.connect(mongoUri, { useNewUrlParser: true });
      }
    } catch (err) {
      throw err; // TODO: Handle exception
    }
  }

  public async down() {
    try {
      if (this.client) {
        await this.client.close();
      }
      if (this.options.mock && this.mockServer) {
        this.mockServer.stop();
      }
    } catch (err) {
      throw err; // TODO: Handle exception
    }
  }

  public getDb(name ?: string): Db {
    try {
      return this.client!.db(name ? name : this.options.name);
    } catch (err) {
      throw err;
    }

  }

}
