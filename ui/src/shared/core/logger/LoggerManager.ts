import { EventEmitter } from "events";
import { LogEntry } from "winston";
import { Logger } from "./Logger";
import { LogManagerOptions } from "./Logger.interface";
import winston from "winston";

export class LogManager extends EventEmitter {
  private _options: LogManagerOptions = {
    minLevels: {
      "": "info",
    },
  };
  private _loggerIsRegistered = false;

  public configure(options: LogManagerOptions): LogManager {
    this._options = Object.assign({}, this._options, options);
    return this;
  }

  public getLogger(module: string): Logger {
    let maxLevel = "none";
    let match = "";

    const { minLevels = {} } = this._options;
    for (const moduleKey in minLevels) {
      const startsWithKey = module.startsWith(moduleKey);
      if (!startsWithKey || moduleKey.length < match.length) {
        continue;
      }
      maxLevel = minLevels[moduleKey];
      match = moduleKey;
    }

    return new Logger(this, module, {
      maxLevel,
    });
  }

  public onLogEntry(listener: (logEntry: LogEntry) => void): LogManager {
    this.on("log", listener);
    return this;
  }

  public registerConsoleLogger(): LogManager {
    if (this._loggerIsRegistered) {
      return this;
    }

    this.onLogEntry((logEntry) => {
      const { location, module, level, message } = logEntry;
      const msg = `${location} [${module}] ${message}`;
      switch (level) {
        case "trace":
          console.trace(msg);
          break;
        case "debug":
          console.debug(msg);
          break;
        case "info":
          console.info(msg);
          break;
        case "warn":
          console.warn(msg);
          break;
        case "error":
          console.error(msg);
          break;
        default:
          console.log(`{${logEntry.level}} ${msg}`);
      }
    });

    this._loggerIsRegistered = true;
    return this;
  }

  public registerWinstonLogger(winstonLogger: winston.Logger): LogManager {
    if (this._loggerIsRegistered) {
      return this;
    }

    this.onLogEntry((logEntry) => {
      const { location, module, level, message } = logEntry;
      const msg = `${location} [${module}] ${message}`;
      switch (level) {
        case "trace":
          winstonLogger.error(msg);
          break;
        case "debug":
          winstonLogger.debug(msg);
          break;
        case "info":
          winstonLogger.info(msg);
          break;
        case "warn":
          winstonLogger.warn(msg);
          break;
        case "error":
          winstonLogger.error(msg);
          break;
        default:
          winstonLogger.log("info", `{${logEntry.level}} ${msg}`);
      }
    });

    this._loggerIsRegistered = true;
    return this;
  }
}

export const logging = new LogManager();
