import FirebaseAuthUser from "@/shared/api/domain/models/User";
import {
  FirebaseAuthProviderTypes,
  OAuthProviderTypes,
} from "@/shared/api/domain/repositories/AuthProvider.interface";
import FirebaseAuthRepository from "@/shared/api/infrastructure/repositories/Auth.repository.";
import { TYPES } from "@/shared/providers/types";
import { inject, injectable } from "inversify";

@injectable()
export default class AccountService {
  constructor(
    @inject(TYPES.Authentication) private _auth: FirebaseAuthRepository
  ) {
    console.log("_auth");
    console.log(this);
  }

  async createUserWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<FirebaseAuthUser> {
    const user = this._auth.createUserWithEmailAndPassword(
      emailAddress,
      password
    );
    return user;
  }

  async signInWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<void> {
    const user = this._auth.signInWithEmailAndPassword(emailAddress, password);
  }

  async signInWithGoogle(): Promise<void> {
    const user = this._auth.signInWithPopUp(FirebaseAuthProviderTypes.Google);
    console.log(user);
  }

  getSlackSignInUrl(): string {
    const redirect = new URL("https://localhost:8082/");
    let slackURL = this._auth.getSignInURL(OAuthProviderTypes.Slack);
    slackURL += `&redirect_uri=${encodeURIComponent(redirect.toString())}`;
    console.log(slackURL);

    return slackURL;
  }
}
