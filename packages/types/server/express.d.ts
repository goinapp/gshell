import { Application, Request, Response, NextFunction, Router } from 'express';
import { IGServer, IGServerOptions } from './server';

declare class GExpress implements IGServer {

    private readonly app: Application;
    private readonly middlewares: GExpressMiddleware[];
    private health: void;

    readonly options: IGServerOptions;

    up(): Promise<void>;
    down(): Promise<void>;

    addRouter: (params: {route?: string, router: Router}) => void;
    
}

declare type GExpressMiddleware = (req: Request, res: Response, next: NextFunction) => (void | Promise<void>);
