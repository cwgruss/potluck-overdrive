import firebase from "firebase/app";
import { TYPES } from "@/shared/providers/types";
import axios from "axios";
import { inject, injectable } from "inversify";
import { OAuthAPIAuthentication } from "../../domain/adapters";
import { EmailAddress } from "../../domain/models/EmailAddress";
import SlackAuthUser from "../../domain/models/SlackUser";
import {
  OAuthProviderTypes,
  OAuthProviderUrls,
} from "../../domain/repositories/AuthProvider.interface";

interface SlackSuccessResponse {
  ok: boolean;
  user: {
    name: string;
    id: string;
    email: string;
    image_24: string;
    image_32: string;
    image_48: string;
    image_72: string;
    image_192: string;
    image_512: string;
    image_1024: string;
  };
  team: {
    id: string;
  };
}

const SLACK_REDIRECT_URI = `https://localhost:8082/slack-signin`;
const scopes = ["identity.basic", "identity.email", "identity.avatar"].join(
  " "
);

@injectable()
export class SlackAuthAdapter implements OAuthAPIAuthentication<SlackAuthUser> {
  private _redirectURI = SLACK_REDIRECT_URI;
  readonly _OAuthAPIURL: string;

  constructor(
    @inject(TYPES.__FirebaseAuth__) private _auth: firebase.auth.Auth
  ) {
    const params = new URLSearchParams({
      client_id:
        encodeURIComponent(`${process.env.VUE_APP_SLACK_CLIENT_ID}`) || "",
      redirect_uri: this._redirectURI,
      scope: scopes,
    });
    this._OAuthAPIURL = this._getSignInURL(
      OAuthProviderTypes.Slack,
      params
    ).toString();
  }

  async getBearerToken(code?: string): Promise<string> {
    const response = await axios.post<SlackSuccessResponse>(
      `https://us-central1-potluck-api-dev.cloudfunctions.net/api/slack/auth`,
      {
        code,
      }
    );

    const { headers } = response;

    return headers["Authorization"];
  }

  async signWithToken(token: string): Promise<SlackAuthUser> {
    const credential = this._auth.signInWithCustomToken(token);
    const user = await this._createUserFromCredential(credential);

    return user;
  }

  private _getSignInURL(
    oauthProviderType: OAuthProviderTypes,
    params: URLSearchParams
  ): URL {
    if (!(oauthProviderType in OAuthProviderUrls)) {
      throw new Error(`${oauthProviderType} is not a valid OAuth type.`);
    }

    if (!params || !params.has("redirect_uri")) {
      throw new Error(
        `Slack authentication requires a 'redirect_uri' property.`
      );
    }

    const originStr = OAuthProviderUrls[oauthProviderType];
    const url = originStr + "?" + params.toString();

    return new URL(url);
  }

  private async _createUserFromCredential(
    credentialPromise: Promise<firebase.auth.UserCredential>
  ): Promise<SlackAuthUser> {
    try {
      const credential = await credentialPromise;
      if (!credential || !credential.user) {
        throw new Error("No User found");
      }
      const {
        displayName,
        email: emailAddress,
        uid,
        photoURL,
      } = credential.user;

      const user = SlackAuthUser.create({
        uid,
        displayName,
        emailAddress: EmailAddress.create(emailAddress),
        photoURL,
      });

      return user;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }
}
