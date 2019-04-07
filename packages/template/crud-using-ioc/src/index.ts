import GExpress, { IGExpressRouter } from "@gshell/express";
import GMongoDB from "@gshell/mongodb";

import { GMicroservice } from "./utils";
import { getContainer } from "./installer";
import { TYPES } from "./types";
import { mongoOptions, expressOptions } from "./config";

const mongo =  new GMongoDB(mongoOptions);
const express =  new GExpress(expressOptions);

const gshell = new GMicroservice([ mongo, express ]);

const install = () => {
  const container = getContainer(mongo.getDb());
  const userRouter: IGExpressRouter = container.get<IGExpressRouter>(TYPES.UserRouter);
  express.addRouter({ route: "/user", router: userRouter.getRouter()})
};

gshell.start().then(() => install());
