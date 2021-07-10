enum LOG_LEVELS {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  HTTP = 3,
  DEBUG = 4,
  TRACE = 5,
}

export const DEFAULT_LOG_LEVELS = {
  error: LOG_LEVELS.ERROR,
  warn: LOG_LEVELS.WARN,
  info: LOG_LEVELS.INFO,
  http: LOG_LEVELS.HTTP,
  debug: LOG_LEVELS.DEBUG,
  trace: LOG_LEVELS.TRACE,
};

export type LogLevelKeys = keyof typeof DEFAULT_LOG_LEVELS;

export interface LogEntry {
  level: string;
  module: string;
  location?: string;
  message: string;
}

export interface LogManagerOptions {
  minLevels: { [module: string]: string };
}

export interface LoggerOptions {
  maxLevel: LogLevelKeys | string;
}

// export interface Logger {
//   configure(options: LoggerOptions): void;
// }
