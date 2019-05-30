
import { IGFastifyRouter } from "@gshell/fastify";
import { FastifyInstance } from "fastify";
import { GFastifyRequest, GFastifyResponse } from '@gshell/fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

class HelloRouter implements IGFastifyRouter {

  getRouter = (fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: any, next: Function) => {

    fastify.get("/", this.helloWorld);
    fastify.get("/:name", this.helloName);
    next();

  }

  private helloWorld = async (req: GFastifyRequest, res: GFastifyResponse): Promise<void> => {
    console.log("Hello World!");
    res.code(200).send({ message: "Hello World!" })
  };

  private helloName = async (req: GFastifyRequest, res: GFastifyResponse): Promise<void> => {
    const { name = "unKnown" } = req.params;
    console.log(`Hello ${name}!`);
    res.code(200).send({ message: `Hello ${name}!` })
  };
}

export default new HelloRouter();
