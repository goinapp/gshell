import GExpress from "@gshell/express";
import { helloRouter } from "./routes";

const port = 3001;

async function main() { // Yes, main(), because why not?
  try {
    const server = new GExpress({ port }, []);

    server.addRouter({ route: "/hello", router: helloRouter });
    await server.up();

    console.log("Server up and running on port " + port);
  } catch (err) {
    console.error("Error on server startup: ", err);
  }
}

main();
