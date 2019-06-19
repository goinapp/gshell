import { IGWorker } from "../core/worker";

interface IGServer extends IGWorker {
    options: IGServerOptions;
}

interface IGServerOptions {
    port: number;
}

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type GRouteOptions = {
  schema?: any;
  attachValidation?: boolean;
  onRequest?: (request, response, done) => any;
  preValidation?: (request, response, done) => any;
  preHandler?: (request, response, done) => any;
  preSerialization?: (request, response, payload, done) => any;
  handler?: (request, response) => any;
  schemaCompiler?: (schema) => any;
  bodyLimit?: Number;
  logLevel?: string;
  config?: any;
  version?: string;
  prefixTrailingSlash?: boolean;
}

type GRoute<T, K> = {
  method: HttpMethod;
  url: string;
  handler: (request: T, response: K) => any;
  options?: GRouteOptions;
}

export { IGServer, IGServerOptions, HttpMethod, GRoute, GRouteOptions };
