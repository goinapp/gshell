import GExpress from "@gshell/express";
import GMongoDB from "@gshell/mongodb";
import { userRouter } from "./routes";
import UserManager from "./logic/user.manager";
import { json } from "express";

const port = 3000;
const dbName = "gshell";

async function main() { // Yes, main(), because why not?
  try {
    const mongo = new GMongoDB({ uri: "mongodb://root:toor123@ds133256.mlab.com:33256/gshell", name: dbName });
    await mongo.up();
    console.log("Connected to database");
    UserManager.init(mongo.getDb(dbName));

    const server = new GExpress({ port }, [json()]);
    server.addRouter({ route: "/user", router: userRouter });

    await server.up();
    console.log("Server up and running on port " + port);
  } catch (err) {
    console.error("Error on server startup: ", err);
  }
}

main();
