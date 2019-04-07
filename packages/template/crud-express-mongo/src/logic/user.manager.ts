import { Db, ObjectId } from "mongodb";

interface IMongoIdentifier {
  _id: ObjectId;
}

interface IUserData {
  name: string;
  favColor: string;
}

interface IUserDocument extends IUserData, IMongoIdentifier {}

export default class UserManager {
  private static readonly collection = "users";
  public static db: Db;

  static init = (db: Db) => {
    UserManager.db = db;
  };

  static getUsers = async (): Promise<IUserDocument[]> => {
    return await UserManager.db
      .collection(UserManager.collection)
      .find()
      .toArray();
  };

  static createUser = async (userData: IUserData): Promise<string> => {
    const result = await UserManager.db
      .collection(UserManager.collection)
      .insertOne(userData);
    return result.insertedId.toHexString();
  };

  static getUser = async (userId: string): Promise<IUserDocument> => {
    return await UserManager.db
      .collection(UserManager.collection)
      .findOne({ _id: new ObjectId(userId) });
  };

  static updateUser = async (userId: string, userData: IUserData): Promise<boolean> => {
    const result = await UserManager.db
      .collection(UserManager.collection)
      .updateOne({ _id: new ObjectId(userId) }, { $set: userData }, { upsert: false });
    console.log("Result", result);
    return result.modifiedCount === 1;
  };

  static deleteUser = async (userId: string): Promise<boolean> => {
    const result = await UserManager.db
      .collection(UserManager.collection)
      .deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount === 1;
  };
}
