import { Application, Router } from "express";
import { authenticateSlack } from "./slack/user.controller";
import { Request, Response, NextFunction } from "express";
import {
  UpdateAccountAccessController,
  GetAccountAccessController,
} from "./access/access.controller";
import { firestore } from "firebase-admin";

export function routesConfig(app: Application, db: firestore.Firestore) {
  const accountRouter: Router = Router();

  const updateAccountAccessController = new UpdateAccountAccessController(db);
  const getAccountAccessController = new GetAccountAccessController(db);

  accountRouter.put("/account/:uid/access", (req, res) =>
    updateAccountAccessController.execute(req, res)
  );

  accountRouter.get("/account/:uid/access", (req, res) =>
    getAccountAccessController.execute(req, res)
  );

  app.use(accountRouter);

  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({
      ok: true,
      message: "It works!",
    });
  });
  app.post("/slack/auth", authenticateSlack);
}
