import { Logger, LoggerOptions } from "winston";
import * as winston from "winston";
import * as Transport from "winston-transport";
import { LoggingWinston } from "@google-cloud/logging-winston";
import { Format } from "logform";
import { IGLogger } from "@gshell/types";

export default class GWinston implements IGLogger {

  public googleWinston: Logger;
  public logger: Logger;

  private readonly options: object;
  private readonly resourceOptions: any;

  constructor(resourceOptions: any) {
    this.googleWinston = new LoggingWinston(resourceOptions);
    this.resourceOptions = resourceOptions;
    this.options = this.getLoggerConfig();
    this.logger = winston.createLogger(this.options);
  }

  public error = (message: string, err?: object, meta?: object) => {
    throw new Error("Not implemented");
  }

  public warn = (message: string, meta?: object) =>  {
    throw new Error("Not implemented");
  }

  public info = (message: string, meta?: object) => {
    throw new Error("Not implemented");
  }

  private getLoggerConfig(): LoggerOptions {
    return {
      transports: this.getTransports(),
      format: this.getFormats(),
    };
  }

  private getTransports(): Transport[] {
    switch (process.env.NODE_ENV) {
      case "test":
        return [
          new winston.transports.File({
            level: "info",
            filename: "tests.log",
          }),
        ];
      case "development":
        return [
          new winston.transports.Console({
            level: "info",
          }),
        ];
      case "production":
      case "staging":
        return [
          this.googleWinston,
        ];
      default:
        return [];
    }
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
