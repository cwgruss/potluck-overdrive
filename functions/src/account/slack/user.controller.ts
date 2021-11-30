import * as functions from "firebase-functions";
import { admin } from "../../shared/infra/firebase";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

const SLACK_OAUTH_ACCESS_URL = "https://slack.com/api/oauth.access";
const SLACK_USER_IDENTITY_URL = "https://slack.com/api/users.identity";

export async function authenticateSlack(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ENV = functions.config();
  const slackENV = ENV.slack;

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).send({ message: `Missing field 'code'` });
    }

    const response = await axios.post(
      SLACK_OAUTH_ACCESS_URL,
      new URLSearchParams({
        client_id: slackENV.client_id,
        client_secret: slackENV.client_secret,
        code,
        redirect_uri: slackENV.redirect_uri,
      }),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response?.data?.ok === false) {
      return res.status(500).send({
        message: `Unable to authenticate using Slack.`,
        error: response?.data?.error,
      });
    }

    const { access_token } = response.data;
    const userRes = await axios.get(SLACK_USER_IDENTITY_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { user, team, ok } = userRes.data;

    if (!ok || !user.id) {
      return res.status(401).send({
        message: `Unable to authenticate using Slack. User does not contain a valid id`,
        error: "no_uid_provided",
      });
    }

    const firebaseToken = await admin.auth().createCustomToken(user.id);

    return res
      .status(200)
      .header({
        "Content-Type": "text/json",
        Authorization: `Bearer ${firebaseToken}`,
      })
      .send({ ok, user, team });
  } catch (err) {
    return handleError(res, err);
  }
}

function handleError(res: Response, err: any) {
  return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
