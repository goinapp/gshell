
interface IGLogger {
    error(options: {title: string, err?: object, meta?: object}): void;
    warn(options: {title: string, meta?: object}): void;
    info(options: {title: string, meta?: object}): void;
}

export { IGLogger };
