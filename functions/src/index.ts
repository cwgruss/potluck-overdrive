import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import bodyParser = require("body-parser");
import cors = require("cors");
import { routesConfig } from "./account/routes-config";

admin.initializeApp();

const app = express();
app.use(bodyParser.json());

const corsOptions: cors.CorsOptions = {
  origin: true,
  exposedHeaders: "Authorization",
};

app.use(cors(corsOptions));
routesConfig(app);

export const api = functions.https.onRequest(app);
