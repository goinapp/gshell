import GError from "@gshell/gerror";

export class EnvError extends GError {

  constructor(enVar: string) {
    super(`Missing env variable ${enVar}`);
    this.name = "EnvError";
  }

}
