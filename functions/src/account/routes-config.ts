import { Application } from "express";
import { authenticateSlack } from "./slack/user.controller";
import { Request, Response, NextFunction } from "express";

export function routesConfig(app: Application) {
  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({
      ok: true,
      message: "It works!",
    });
  });
  app.post("/slack/auth", authenticateSlack);
}
