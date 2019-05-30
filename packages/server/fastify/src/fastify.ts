import * as fastify from "fastify";
import * as morgan from "morgan";
import * as helmet from "helmet";

import { IGServer, IGServerOptions } from "@gshell/types";
import { Server, IncomingMessage, ServerResponse } from "http";
import { Http2Server, Http2ServerRequest, Http2ServerResponse } from "http2";

declare type GFastifyMiddleware = (req, res, next?) => (void | Promise<void>);

export type GFastifyRequest = fastify.FastifyRequest<IncomingMessage | Http2ServerRequest>;
export type GFastifyResponse = fastify.FastifyReply<ServerResponse | Http2ServerResponse>;


export interface IGFastifyOptions extends IGServerOptions {
  middlewares?: GFastifyMiddleware[];
  morganOptions?: morgan.Options;
}

export interface IGFastifyRouter {
  getRouter: (fastify: fastify.FastifyInstance, opts: any, next: Function) => void
}

export default class GFastify implements IGServer {
  private readonly app: fastify.FastifyInstance<Server | Http2Server, IncomingMessage | Http2ServerRequest, ServerResponse | Http2ServerResponse>;
  private readonly middlewares: GFastifyMiddleware[];

  readonly options: IGFastifyOptions;

  constructor(options: IGFastifyOptions) {
    this.options = options;
    const { middlewares = [], morganOptions } = options;

    this.app = fastify({});
    this.middlewares = middlewares;

    this.app.use(morgan("combined", morganOptions));
    this.app.use(helmet());
    this.middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });

    this.app.get("/health", {},  (req: GFastifyRequest, res: GFastifyResponse): void | Promise<any> => {
      res.code(200).send("OK");
    })
    // TODO Default error handling middleware?
  }

  public async up() {
    const address: string = await this.app.listen(this.options.port);
    this.app.log.info(`server listening on ${address}`);
  }

  public async down() {
    this.app && await this.app.close();
  }

  public addRouter(params: { route?: string, router: IGFastifyRouter }) {
    const { route = "/", router } = params;
    this.app.register(router.getRouter, {prefix: route});
  }
}
