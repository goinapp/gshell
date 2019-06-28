import { IGDatabase, IGDatabaseOptions } from "@gshell/types";
import { Db, MongoClient } from "mongodb";

export interface IGMongoDBOptions extends IGDatabaseOptions {
  name: string;
}

export default class GMongoDB implements IGDatabase {

  public readonly options: IGMongoDBOptions;
  private client: MongoClient;

  constructor(options: IGMongoDBOptions) {
    this.options = options;
  }

  public async up() {
    try {
      this.client = await MongoClient.connect(this.options.uri, { useNewUrlParser: true });
    } catch (err) {
      throw err; // TODO: Handle exception
    }
  }

  public async down() {
    try {
      this.client && await this.client.close(); // tslint:disable-line
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
