import * as Ajv from "ajv";
import { ObjectId } from "bson";
import { EnvError } from "../errors/env.error";
import GError from "@gshell/gerror";
import { IGUtils } from "@gshell/types";

const ajv = new Ajv({ allErrors: true, removeAdditional: "all" });

export default class GUtils implements IGUtils {

  public checkEnvironmentVariable(variable: string) {
    if (process.env[variable] === undefined) {
      throw new EnvError(variable);
    }
  }

  public validateObjectWithSchema(schema: object, object: object): void {
    const validate = ajv.compile(schema);
    const valid = validate(object);
    if (!valid) {
      throw new GError("Object does not meet schema", 400, validate.errors);
    }
  }

  public checkValueInEnum(value: any, E: any): any {
    const obj: any = Object
      .keys(E)
      .find((key) => E[key] === value);
    if (!obj) {
      throw new GError("Value does not exist in enum", 417, { value, enum: E });
    }
    return E[obj];
  }

  public isValueInEnum(value: any, E: any): boolean {
    const obj: any = Object
      .keys(E)
      .find((key) => E[key] === value);
    return !!obj;
  }

  public normalizePort(val: number | string): number {
    const p: number = typeof val === "string"
      ? parseInt(val, 10)
      : val;
    if (isNaN(p)) {
      throw new Error("Port invalid");
    } else if (p >= 0) {
      return p;
    } else {
      throw new Error("Port invalid");
    }
  }

  // converts a 256 bit hash into an objectId
  public hashToObjectId(hash: string): ObjectId {
    return new ObjectId(hash.substr(hash.length - 24));
  }

  public wait(delay: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  }

}
