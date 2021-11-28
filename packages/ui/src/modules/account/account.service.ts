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

  get slackSignInURL(): string {
    return this._slack._OAuthAPIURL;
  }

  async createNewUserWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<Result<FirebaseAuthUser, Error>> {
    try {
      const user = await this._firebase.registerUserWithEmailAndPassword(
        emailAddress,
        password
      );

      return Result.ok(user);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }

  async signInWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<Result<FirebaseAuthUser, Error>> {
    try {
      const user = await this._firebase.signInWithEmailAndPassword(
        emailAddress,
        password
      );

      return Result.ok(user);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }

  async signInWithGoogle(): Promise<Result<FirebaseAuthUser, Error>> {
    try {
      const user = await this._firebase.signInWithPopUp(
        FirebaseAuthProviderTypes.Google
      );

      if (!user) {
        return Result.fail(new Error("Unable to login with Google"));
      }

      return Result.ok(user);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }

  async signInWithSlack(code: string): Promise<SlackAuthUser> {
    const token = await this._slack.getBearerToken(code);
    const user = await this._slack.signWithToken(token);
    return user;
  }

  async signOut(): Promise<void> {
    return this._auth.signOut();
  }
}
