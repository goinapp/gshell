import { ObjectId } from "bson";

interface IMongoIdentifier {
  _id: ObjectId;
}

interface IUserData {
  name: string;
  favColor: string;
}

interface IUserDocument extends IUserData, IMongoIdentifier {}

export { IUserData, IUserDocument }
