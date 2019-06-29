import { IGWorker } from "../core/worker";
import { ObjectId } from "bson";

export interface IGUtils {
  checkEnvironmentVariable: (variable: string) => void;

  validateObjectWithSchema: (schema: object, object: object) => void;

  checkValueInEnum: (value: any, E: any) => any;

  isValueInEnum: (value: any, E: any) => boolean;

  normalizePort: (val: number | string) => number;

  hashToObjectId: (hash: string) => ObjectId;

  wait: (delay: number) => Promise<void>;
}
