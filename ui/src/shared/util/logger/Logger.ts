import {
  DEFAULT_LOG_LEVELS,
  LogEntry,
  LoggerOptions,
} from "./Logger.interface";
import { LogManager } from "./LoggerManager";

export class Logger {
  private _maanger: LogManager;
  private _module: string;
  private _maxLogLevel: number = -1;
  private readonly _levels: { [level: string]: number } = DEFAULT_LOG_LEVELS;

  constructor(
    manager: LogManager,
    moduleName: string,
    options: LoggerOptions = {
      maxLevel: "error",
    }
  ) {
    this._maanger = manager;
    this._module = moduleName;
    this._maxLogLevel = this._levelStrToInt(options.maxLevel);
  }

  /**
   * Converts a string level into a number
   *
   * @param level
   * @returns
   */
  private _levelStrToInt(level: string): number {
    const lowerCaseLevel = level.toLowerCase();
    if (lowerCaseLevel in this._levels) {
      return this._levels[lowerCaseLevel];
    } else {
      return -1;
    }
  }

  /**
   *
   * @param logLevel
   * @param message
   */
  public log(logLevel: string, message: string): void {
    const levelInt = this._levelStrToInt(logLevel);

    if (levelInt < this._maxLogLevel) {
      return;
    }

    const logEntry: LogEntry = {
      level: logLevel,
      module: this._module,
      message,
    };

    const lineLocation = this._getLogLocation();

    logEntry.location = lineLocation;

    this._maanger.emit("log", logEntry);
  }

  private _getLogLocation(): string {
    const err = new Error("");
    if (!err.stack) {
      return "";
    }

    const caller = err.stack.split("\n");
    let idx = 1;
    while (idx < caller.length && caller[idx].includes("at Logger.Object")) {
      idx++;
    }

    if (idx >= caller.length) {
      return "";
    }

    const lineNumIndx = caller[idx].indexOf("at ") + 3;
    const location = caller[idx].slice(lineNumIndx, caller[idx].length);
    return location;
  }

  public trace(message: string): void {
    this.log("trace", message);
  }
  public debug(message: string): void {
    this.log("debug", message);
  }
  public info(message: string): void {
    this.log("info", message);
  }
  public warn(message: string): void {
    this.log("warn", message);
  }
  public error(message: string): void {
    this.log("error", message);
  }
}
