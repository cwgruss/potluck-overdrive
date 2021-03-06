import SlackAuthUser from "@/shared/api/domain/models/user/SlackUser";
import { FirebaseAuthProviderTypes } from "@/shared/api/domain/repositories/AuthProvider.interface";
import {
  FirebaseAuthAdapter,
  SlackAuthAdapter,
} from "@/shared/api/infrastructure/adapters";
import { TYPES } from "@/shared/providers/types";
import { inject, injectable } from "inversify";
import firebase from "firebase/app";
import { FirebaseAuthUser } from "@/shared/api/domain/models/user/FirebaseUser";
import { Result } from "@/shared/core/monads/result";
import { User } from "@/shared/api/domain/models/user/User";
import { Maybe } from "@/shared/core/monads/maybe/maybe";

@injectable()
export class AccountService {
  constructor(
    @inject(TYPES.FirebaseAuth) private _firebase: FirebaseAuthAdapter,
    @inject(TYPES.SlackAuth) private _slack: SlackAuthAdapter,
    @inject(TYPES.__FirebaseAuth__) private _auth: firebase.auth.Auth
  ) {
    _auth.onAuthStateChanged((user) => {
      console.log(user);
    });
  }

  getCurrentUser(): Result<User, Error> {
    return this._firebase.getCurrentUser();
  }

  get slackSignInURL(): string {
    return this._slack._OAuthAPIURL;
  }

  async createNewUserWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<Result<FirebaseAuthUser, Error>> {
    const user = await this._firebase.registerUserWithEmailAndPassword(
      emailAddress,
      password
    );

    return user;
  }

  async signInWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<Result<FirebaseAuthUser, Error>> {
    const user = await this._firebase.signInWithEmailAndPassword(
      emailAddress,
      password
    );

    return user;
  }

  async signInWithGoogle(): Promise<Result<FirebaseAuthUser, Error>> {
    const result = await this._firebase.signInWithPopUp(
      FirebaseAuthProviderTypes.Google
    );

    return result;
  }

  async signInWithSlack(code: string): Promise<Result<SlackAuthUser, Error>> {
    const token = await this._slack.getBearerToken(code);
    const user = await this._slack.signWithToken(token);
    return user;
  }

  async signOut(): Promise<void> {
    return this._auth.signOut();
  }
}
