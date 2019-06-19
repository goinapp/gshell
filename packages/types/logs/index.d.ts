
interface IGLogger {
    error(options: {message: string, err?: object, meta?: object}): void;
    warn(options: {message: string, meta?: object}): void;
    info(options: {message: string, meta?: object}): void;
}

export { IGLogger };
