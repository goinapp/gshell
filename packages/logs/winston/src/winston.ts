import { Logger, LoggerOptions } from "winston";
import * as winston from "winston";
import * as Transport from "winston-transport";
import { LoggingWinston } from "@google-cloud/logging-winston";
import { Format } from "logform";
import { IGLogger, IGWinstonOptions } from "@gshell/types";

export default class GWinston implements IGLogger {

  public googleWinston: Logger;
  public logger: Logger;

  private transports: Transport[];
  private readonly resourceOptions: IGWinstonOptions;

  constructor(resourceOptions: IGWinstonOptions, transports: Transport[]) {
    this.resourceOptions = resourceOptions;
    this.transports = transports;
  }

  public up = async () => {
    this.googleWinston = new LoggingWinston(this.resourceOptions);
    this.logger = winston.createLogger(this.getLoggerConfig());
  }

  public down = async () => {
    // Not needed
  }

  public error = (message: string, err?: object, meta?: object) => {
    this.logger.error(message, { ...meta, ...err });
  }

  public warn = (message: string, meta?: object) => {
    this.logger.warn(message, { ...meta });
  }

  public info = (message: string, meta?: object) => {
    this.logger.info(message, { ...meta });
  }

  private getLoggerConfig(): LoggerOptions {
    return {
      transports: this.transports,
      format: this.getFormats(),
    };
  }

  private getFormats(): Format {
    const consoleFormat = winston.format.printf((info) => {
      return `${info.timestamp} [${info.label}] ${info.level}: ${info.message} \nmetadata: ` +
        JSON.stringify(info, null, 4);
    });
    return winston.format.combine(
      winston.format.label({
        label: this.resourceOptions.resource.labels.container_name,
      }),
      winston.format.timestamp(),
      winston.format.prettyPrint(),
      winston.format.splat(),
      winston.format.json(),
      consoleFormat,
    );
  }

}
