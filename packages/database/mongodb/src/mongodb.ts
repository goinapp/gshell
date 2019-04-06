import { IGDatabase, IGDatabaseOptions } from "@gshell/types";
import { Db, MongoClient } from "mongodb";

export default class GMongoDB implements IGDatabase {

  constructor(options: IGDatabaseOptions) {
    this.options = options;
  }

  private client: MongoClient;

  readonly options: IGDatabaseOptions;

  public async up() {
    try {
      this.client = await MongoClient.connect(this.options.uri, { useNewUrlParser: true });
    } catch (err) {
      throw err; // TODO: Handle exception
    }
  }

  public async down() {
    try {
      this.client && await this.client.close();
    } catch (err) {
      throw err; // TODO: Handle exception
    }
  }

  public getDb(name ? : string): Db {
    try {
      return this.client!.db(name ? name : this.options.name);
    } catch (err) {
      throw err;
    }

  }

}