
interface IGLogger {
  error(message: string, err?: object, meta?: object): void;
  warn(message: string, meta?: object): void;
  info(message: string, meta?: object): void;
}

export { IGLogger };
