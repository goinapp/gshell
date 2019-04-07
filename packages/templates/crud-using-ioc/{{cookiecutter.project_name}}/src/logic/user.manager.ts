import { Db, ObjectId } from "mongodb";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IUserDocument, IUserData } from "../model/user.model";

export interface IUserManager {
  getUsers(): Promise<IUserDocument[]>;
  createUser(userData: IUserData): Promise<string>;
  getUser(userId: string): Promise<IUserDocument>;
  updateUser(userId: string, userData: IUserData): Promise<boolean>;
  deleteUser(userId: string): Promise<boolean>;
}

@injectable()
export default class UserManager implements IUserManager {
  private static readonly collection = "users";
  private readonly db: Db;

  constructor(
    @inject(TYPES.MongoDbClient) db: Db,
  ) {
    this.db = db;
  }

  getUsers = async (): Promise<IUserDocument[]> => {
    return await this.db
      .collection(UserManager.collection)
      .find()
      .toArray();
  };

  createUser = async (userData: IUserData): Promise<string> => {
    const result = await this.db
      .collection(UserManager.collection)
      .insertOne(userData);
    return result.insertedId.toHexString();
  };

  getUser = async (userId: string): Promise<IUserDocument> => {
    return await this.db
      .collection(UserManager.collection)
      .findOne({ _id: new ObjectId(userId) });
  };

  updateUser = async (userId: string, userData: IUserData): Promise<boolean> => {
    const result = await this.db
      .collection(UserManager.collection)
      .updateOne({ _id: new ObjectId(userId) }, { $set: userData }, { upsert: false });
    return result.modifiedCount === 1;
  };

  deleteUser = async (userId: string): Promise<boolean> => {
    const result = await this.db
      .collection(UserManager.collection)
      .deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount === 1;
  };
}
