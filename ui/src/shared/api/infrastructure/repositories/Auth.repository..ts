import { inject, injectable } from "inversify";
import firebase from "firebase/app";
import Authentication from "@/shared/api/domain/repositories/Auth.interface";
import FirebaseAuthUser from "@/shared/api/domain/models/User";
import {
  AuthProvider,
  FirebaseAuthProviderTypes,
  OAuthProviderTypes,
  OAuthProviderUrls,
} from "@/shared/api/domain/repositories/AuthProvider.interface";
import { TYPES } from "@/shared/providers/types";

@injectable()
export default class FirebaseAuthRepository implements Authentication {
  constructor(@inject(TYPES.FirebaseAuth) private _auth: firebase.auth.Auth) {}

  async createUserWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<FirebaseAuthUser> {
    const credential = this._auth.createUserWithEmailAndPassword(
      emailAddress,
      password
    );
    const user = this._createUserFromCredential(credential);
    return user;
  }

  async signInWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<FirebaseAuthUser> {
    const credential = this._auth.signInWithEmailAndPassword(
      emailAddress,
      password
    );
    const user = await this._createUserFromCredential(credential);
    return user;
  }

  async signInWithPopUp(
    providerType: FirebaseAuthProviderTypes
  ): Promise<FirebaseAuthUser> {
    const provider = AuthProvider[providerType];
    if (!provider) {
      throw new Error("");
    }
    const credential = this._auth.signInWithPopup(provider);
    const user = await this._createUserFromCredential(credential);
    return user;
  }

  getSignInURL(oauthProviderType: OAuthProviderTypes): string {
    if (!(oauthProviderType in OAuthProviderUrls)) {
      throw new Error(`${oauthProviderType} is not a valid OAuth type.`);
    }
    return OAuthProviderUrls[oauthProviderType];
  }

  private async _createUserFromCredential(
    credentialPromise: Promise<firebase.auth.UserCredential>
  ): Promise<FirebaseAuthUser> {
    try {
      const credential = await credentialPromise;
      if (!credential || !credential.user) {
        throw new Error("No User found");
      }
      const { displayName, email: emailAddress } = credential.user;
      const user = new FirebaseAuthUser(displayName, emailAddress, credential);
      return user;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }
}