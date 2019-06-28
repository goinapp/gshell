import { Server } from "http";
import { Application, Router, Request, Response, NextFunction } from "express";
import * as express from "express";
import * as morgan from "morgan";
import * as helmet from "helmet";

import { IGServer, IGServerOptions } from "@gshell/types";

declare type GExpressMiddleware = (req: Request, res: Response, next: NextFunction) => (void | Promise<void>);

export interface IGExpressOptions extends IGServerOptions {
  middlewares?: GExpressMiddleware[];
  morganOptions?: morgan.Options;
}

export interface IGExpressRouter {
  getRouter(): Router;
}

export default class GExpress implements IGServer {
  private readonly app: Application;
  private readonly middlewares: GExpressMiddleware[];
  private server?: Server;

  private readonly options: IGExpressOptions;

  constructor(options: IGExpressOptions) {
    this.options = options;
    const { middlewares = [], morganOptions } = options;

    this.app = express();
    this.middlewares = middlewares;

    this.app.use(morgan("combined", morganOptions));
    this.app.use(helmet());
    this.middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });

    this.app.get("/health", (req: Request, res: Response) => {
      return res.status(200).send("OK");
    });
    // TODO Default error handling middleware?
  }

  public async up() {
    this.server = this.app.listen(this.options.port);
  }

  public async down() {
    this.server && this.server.close();
  }

  public addRouter(params: { route?: string, router: Router }) {
    const { route = "/", router } = params;
    this.app.use(route, router);
  }
}
