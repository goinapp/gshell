import * as fastify from "fastify";
import * as morgan from "morgan";
import * as helmet from "helmet";

import { IGServer, IGServerOptions, GRoute, HttpMethod, GRouteOptions } from "@gshell/types/server";
import { Server, IncomingMessage, ServerResponse } from "http";
import { Http2Server, Http2ServerRequest, Http2ServerResponse } from "http2";
import { FastifyInstance } from "fastify";

declare type GFastifyMiddleware = (req, res, next?) => void | Promise<void>;

export type GFastifyRequest = fastify.FastifyRequest<IncomingMessage | Http2ServerRequest>;
export type GFastifyResponse = fastify.FastifyReply<ServerResponse | Http2ServerResponse>;

export interface IGFastifyOptions extends IGServerOptions {
  middlewares?: GFastifyMiddleware[];
  morganOptions?: morgan.Options;
}

class GRouter<T, K> {
  private _routes: Array<GRoute<T, K>> = []; // tslint:disable-line

  public route = (
    method: HttpMethod,
    url: string,
    handler: (request: T, response: K) => any,
    options: GRouteOptions,
  ): GRouter<T, K> => {
    const route: GRoute<T, K> = { method, url, handler, options };
    this._routes.push(route);
    return this;
  }

  public get = (
    url: string,
    handler: (request: T, response: K) => Promise<any>,
    options: GRouteOptions,
  ): GRouter<T, K> => {
    return this.route("GET", url, handler, options);
  }

  public post = (
    url: string,
    handler: (request: T, response: K) => Promise<any>,
    options: GRouteOptions,
  ): GRouter<T, K> => {
    return this.route("POST", url, handler, options);
  }

  public patch = (
    url: string,
    handler: (request: T, response: K) => Promise<any>,
    options: GRouteOptions,
  ): GRouter<T, K> => {
    return this.route("PATCH", url, handler, options);
  }

  public put = (
    url: string,
    handler: (request: T, response: K) => Promise<any>,
    options: GRouteOptions,
  ): GRouter<T, K> => {
    return this.route("PUT", url, handler, options);
  }

  public delete = (
    url: string,
    handler: (request: T, response: K) => Promise<any>,
    options: GRouteOptions,
  ): GRouter<T, K> => {
    return this.route("DELETE", url, handler, options);
  }

  public get routes(): Array<GRoute<T, K>> {
    return this.routes;
  }
}

// tslint:disable-next-line
export class GFastifyRouter {
  public routes: Array<GRoute<GFastifyRequest, GFastifyResponse>>;

  constructor(router: GRouter<GFastifyRequest, GFastifyResponse>) {
    this.routes = router.routes;
  }

  public registerRoutes = (
    fastifyInstance: FastifyInstance<Server, IncomingMessage, ServerResponse>,
    opts: any,
    next: Function, // tslint:disable-line
  ) => {
    for (const route of this.routes) {
      const routeOpts: fastify.RouteOptions = {
        ...route.options,
        method: route.method,
        handler: route.handler,
        url: route.url,
      };
      fastifyInstance.route(routeOpts);
    }
    next();
  }
}

// tslint:disable-next-line
export default class GFastify implements IGServer {
  private readonly app: fastify.FastifyInstance<
    Server | Http2Server,
    IncomingMessage | Http2ServerRequest,
    ServerResponse | Http2ServerResponse
  >;
  private readonly middlewares: GFastifyMiddleware[];

  private readonly options: IGFastifyOptions;

  constructor(options: IGFastifyOptions) {
    this.options = options;
    const { middlewares = [], morganOptions } = options;

    this.app = fastify({});
    this.middlewares = middlewares;

    this.app.use(morgan("combined", morganOptions));
    this.app.use(helmet());
    this.app.register(require("fastify-swagger"), {
      exposeRoute: true,
      routePrefix: "/docs",
      swagger: {
        info: {
          title: "Test",
          description: "Test test",
          version: "1.0.0",
        },
        host: "localhost",
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
        securityDefinitions: {
          apiKey: {
            type: "apiKey",
            name: "apiKey",
            in: "header",
          },
        },
      },
    });
    this.middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });

    this.app.get(
      "/health",
      {},
      (req: GFastifyRequest, res: GFastifyResponse): void | Promise<any> => {
        res.code(200).send("OK");
      },
    );
    // TODO Default error handling middleware?
  }

  public async up() {
    const address: string = await this.app.listen(this.options.port);
    this.app.log.info(`server listening on ${address}`);
  }

  public async down() {
    if (this.app) {
      await this.app.close();
    }
  }

  public addRouter(route: string, router: GRouter<GFastifyRequest, GFastifyResponse>) {
    const fastifyRouter = new GFastifyRouter(router);
    this.app.register(fastifyRouter.registerRoutes, { prefix: route });
  }
}
