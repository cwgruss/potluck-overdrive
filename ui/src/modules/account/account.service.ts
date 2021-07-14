import FirebaseAuthUser from "@/shared/api/domain/models/FirebaseUser";
import SlackAuthUser from "@/shared/api/domain/models/SlackUser";
import { FirebaseAuthProviderTypes } from "@/shared/api/domain/repositories/AuthProvider.interface";
import {
  FirebaseAuthAdapter,
  SlackAuthAdapter,
} from "@/shared/api/infrastructure/adapters";
import { TYPES } from "@/shared/providers/types";
import { inject, injectable } from "inversify";

@injectable()
export class AccountService {
  constructor(
    @inject(TYPES.FirebaseAuth) private _firebase: FirebaseAuthAdapter,
    @inject(TYPES.SlackAuth) private _slack: SlackAuthAdapter
  ) {}

  get slackSignInURL(): string {
    return this._slack._OAuthAPIURL;
  }

  async createNewUserWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<FirebaseAuthUser> {
    const user = this._firebase.registerUserWithEmailAndPassword(
      emailAddress,
      password
    );
    return user;
  }

  async signInWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<void> {
    const user = this._firebase.signInWithEmailAndPassword(
      emailAddress,
      password
    );
  }

  async signInWithGoogle(): Promise<void> {
    const user = this._firebase.signInWithPopUp(
      FirebaseAuthProviderTypes.Google
    );
    console.log(user);
  }

  async signInWithSlack(code: string): Promise<SlackAuthUser> {
    const token = await this._slack.getBearerToken(code);
    const user = await this._slack.signWithToken(token);
    console.log(user);
    return user;
  }
}
