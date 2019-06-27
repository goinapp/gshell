import { Logger, LoggerOptions } from "winston";
import * as winston from "winston";
import * as Transport from "winston-transport";
import { LoggingWinston } from "@google-cloud/logging-winston";
import { Format } from "logform";
import { IGLogger } from '@gshell/types';

export default class GWinston implements IGLogger {

  constructor(resourceOptions: object) {
    this.googleWinston = new LoggingWinston(resourceOptions);
    this.resourceOptions = resourceOptions;
    this.options = this.getLoggerConfig();
    this.logger = winston.createLogger(this.options);
  }

  private readonly options: object;
  private readonly resourceOptions: object;

  public googleWinston: Logger;
  public logger: Logger;

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
          })
        ];
      case "development":
        return [
          new winston.transports.Console({
            level: "info",
          })
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
        label: this.resourceOptions['resource'].labels.container_name
      }),
      winston.format.timestamp(),
      winston.format.prettyPrint(),
      winston.format.splat(),
      winston.format.json(),
      consoleFormat,
    );
  }

  error = (message: string, err?: object, meta?: object) => {

  };

  warn = (message: string, meta?: object) =>  {

  };

  info = (message: string, meta?: object) => {

  }

}
