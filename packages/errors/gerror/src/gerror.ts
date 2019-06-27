export class GError extends Error {
  public code?: number;
  public bodyErrors?: any;

  constructor(message: string, code?: number, bodyErrors?: any) {
    super(`[GSHELL] ${message}`);
    this.code = code;
    this.bodyErrors = bodyErrors;
    (Object as any).setPrototypeOf(this, new.target.prototype);
    this.name = "GError";
  }
}
