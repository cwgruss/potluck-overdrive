import { inject, injectable } from "inversify";
import firebase from "firebase/app";
import { FirebaseAuthentication } from "@/shared/api/domain/adapters";
import { FirebaseAuthUser } from "@/shared/api/domain/models/FirebaseUser";
import {
  AuthProvider,
  FirebaseAuthProviderTypes,
} from "@/shared/api/domain/repositories/AuthProvider.interface";
import { TYPES } from "@/shared/providers/types";
import { EmailAddress } from "../../domain/models/EmailAddress";

@injectable()
export class FirebaseAuthAdapter implements FirebaseAuthentication {
  constructor(
    @inject(TYPES.__FirebaseAuth__) private _auth: firebase.auth.Auth
  ) {}

  async registerUserWithEmailAndPassword(
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
      throw new Error(`Invalid Provider: ${providerType} is not supported.`);
    }
    const credential = this._auth.signInWithPopup(provider);
    const user = await this._createUserFromCredential(credential);
    return user;
  }

  private async _createUserFromCredential(
    credentialPromise: Promise<firebase.auth.UserCredential>
  ): Promise<FirebaseAuthUser> {
    try {
      const credential = await credentialPromise;

      if (!credential || !credential.user) {
        throw new Error("No User found with those credentials");
      }

      const {
        displayName,
        email: emailAddress,
        uid,
        photoURL,
      } = credential.user;

      const user = FirebaseAuthUser.create({
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
