import "reflect-metadata";
import { Container } from "inversify";

import { TYPES } from "./types";
import { IGExpressRouter } from "@gshell/express/dist";
import { UserRouter } from "./routes";
import { Db } from "mongodb";
import UserManager, { IUserManager } from "./logic/user.manager";

export const getContainer = (mongoDb: Db): Container => {
  const container = new Container();
  container.bind<Db>(TYPES.MongoDbClient).toConstantValue(mongoDb);
  container.bind<IGExpressRouter>(TYPES.UserRouter).to(UserRouter).inSingletonScope();
  container.bind<IUserManager>(TYPES.UserManager).to(UserManager).inSingletonScope();
  return container;
};
