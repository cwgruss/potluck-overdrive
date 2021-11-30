import * as express from "express";
import bodyParser = require("body-parser");
import cors = require("cors");
import { routesConfig } from "./account/routes-config";
import { initializeApp } from "./shared/infra/firebase";
import * as functions from "firebase-functions";

let app: express.Application = express();

initializeApp().then(({ admin, db }) => {
  app.use(bodyParser.json());

  const corsOptions: cors.CorsOptions = {
    origin: true,
    exposedHeaders: "Authorization",
  };

  app.use(cors(corsOptions));
  routesConfig(app, db);
});

export const api = functions.https.onRequest(app);
