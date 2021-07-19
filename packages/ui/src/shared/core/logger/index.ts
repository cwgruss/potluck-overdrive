import { LogManager } from "./LoggerManager";
export * from "./Logger";
export * from "./LoggerManager";

export const logging = new LogManager()
  .configure({
    minLevels: {
      "": "error",
      util: "error",
      modules: "error",
    },
  })
  .registerConsoleLogger();
