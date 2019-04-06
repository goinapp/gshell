import { Router, Request, Response, NextFunction } from "express";
import { IGServer, IGServerOptions } from "@gshell/types";
declare type GExpressMiddleware = (req: Request, res: Response, next: NextFunction) => (void | Promise<void>);
export default class GExpress implements IGServer {
    private readonly app;
    private readonly middlewares;
    private server?;
    readonly options: IGServerOptions;
    constructor(options: IGServerOptions, middlewares: GExpressMiddleware[]);
    up(): Promise<void>;
    down(): Promise<void>;
    addRouter(params: {
        route?: string;
        router: Router;
    }): void;
}
export {};
