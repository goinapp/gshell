import { json } from "express";
import { IGExpressOptions } from "@gshell/express";
import { IGMongoDBOptions } from "@gshell/mongodb";

const mongoOptions: IGMongoDBOptions = {
  uri: "mongodb://root:toor123@ds133256.mlab.com:33256/gshell",
  name: "gshell"
};
const expressOptions: IGExpressOptions = {
  port: 3000,
  middlewares: [
    json(),
  ],
};

export { mongoOptions, expressOptions };
