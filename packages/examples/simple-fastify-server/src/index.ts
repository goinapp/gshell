import GFastify from "@gshell/fastify";
import helloRouter from "./routes";

const port = 3000;

async function main() { // Yes, main(), because why not?
  try {
    const server = new GFastify({ port });

    server.addRouter("/hello", helloRouter);
    await server.up();

    console.log("Server up and running on port " + port);
    console.log(server.app.swagger({yaml: true}))
  } catch (err) {
    console.error("Error on server startup: ", err);
  }
}

main();
