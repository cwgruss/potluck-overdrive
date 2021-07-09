import FirebaseAuthUser from "@/api/domain/models/User";
import { AuthProviderTypes } from "@/api/domain/repositories/AuthProvider.interface";
import FirebaseAuthRepository from "@/api/infrastructure/repositories/Auth.repository.";
import { TYPES } from "@/api/providers/types";
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
    const user = this._auth.signInWithPopUp(AuthProviderTypes.Google);
    console.log(user);
  }

  async signInWithApple(): Promise<void> {
    const user = this._auth.signInWithPopUp(AuthProviderTypes.Apple);
  }

  async signInWithSlack(): Promise<void> {
    const user = this._auth.signInWithPopUp(AuthProviderTypes.Slack);
  }
}
