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
    return new Promise((resolve, reject) => {
      this._auth
        .createUserWithEmailAndPassword(emailAddress, password)
        .then(async (credential) => {
          const user = await this._createUserFromCredential(credential);
          resolve(user);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async signInWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<FirebaseAuthUser> {
    return new Promise((resolve, reject) => {
      return this._auth
        .signInWithEmailAndPassword(emailAddress, password)
        .then(async (credential) => {
          console.log(credential);
          const user = await this._createUserFromCredential(credential);
          return resolve(user);
        })
        .catch((error) => {
          console.error(error);
          return reject(error);
        });
    });
  }

  async signInWithPopUp(
    providerType: FirebaseAuthProviderTypes
  ): Promise<FirebaseAuthUser> {
    return new Promise((resolve, reject) => {
      const provider = AuthProvider[providerType];
      if (!provider) {
        throw new Error(`Invalid Provider: ${providerType} is not supported.`);
      }

      this._auth
        .signInWithPopup(provider)
        .then(async (credential) => {
          const user = await this._createUserFromCredential(credential);
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private async _createUserFromCredential(
    credential: firebase.auth.UserCredential
  ): Promise<FirebaseAuthUser> {
    if (!credential || !credential.user) {
      throw new Error("No User found with those credentials");
    }

    const { displayName, email: emailAddress, uid, photoURL } = credential.user;

    const user = FirebaseAuthUser.create({
      uid,
      displayName,
      emailAddress: EmailAddress.create(emailAddress),
      photoURL,
    });

    return user;
  }
}
