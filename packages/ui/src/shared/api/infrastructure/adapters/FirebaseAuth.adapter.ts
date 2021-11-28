import { inject, injectable } from "inversify";
import firebase from "firebase/app";
import { FirebaseAuthentication } from "@/shared/api/domain/adapters";
import { FirebaseAuthUser } from "@/shared/api/domain/models/user/FirebaseUser";
import {
  AuthProvider,
  FirebaseAuthProviderTypes,
} from "@/shared/api/domain/repositories/AuthProvider.interface";
import { TYPES } from "@/shared/providers/types";
import { EmailAddress } from "../../domain/models/user/EmailAddress";
import { Maybe } from "@/shared/core/monads/maybe/maybe";
import { User } from "../../domain/models/user/User";
import { Result } from "@/shared/core/monads/result";

@injectable()
export class FirebaseAuthAdapter implements FirebaseAuthentication {
  constructor(
    @inject(TYPES.__FirebaseAuth__) private _auth: firebase.auth.Auth
  ) {}

  getFirebaseUser(): firebase.User | null {
    const userData = this._auth.currentUser;
    return userData!;
  }

  getCurrentUser(): Result<User, Error> {
    const data = this.getFirebaseUser();
    if (!data) {
      return Result.fail(new Error("No user is currently signed in"));
    }

    const user = User.create({
      uid: data?.uid,
      displayName: data?.displayName,
      emailAddress: EmailAddress.create(data?.email),
      photoURL: data?.photoURL,
    });

    return user;
  }

  async registerUserWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<Result<FirebaseAuthUser, Error>> {
    return new Promise((resolve, reject) => {
      this._auth
        .createUserWithEmailAndPassword(emailAddress, password)
        .then(async (credential) => {
          const user = await this._createUserFromCredential(credential);
          return resolve(user);
        })
        .catch((error) => {
          const result = Result.fail<User, Error>(error);
          return resolve(result);
        });
    });
  }

  async signInWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<Result<FirebaseAuthUser, Error>> {
    return new Promise((resolve, reject) => {
      return this._auth
        .signInWithEmailAndPassword(emailAddress, password)
        .then(async (credential) => {
          console.log(credential);
          const user = await this._createUserFromCredential(credential);
          return resolve(user);
        })
        .catch((err) => {
          const result = Result.fail<User, Error>(err);
          return resolve(result);
        });
    });
  }

  async signInWithPopUp(
    providerType: FirebaseAuthProviderTypes
  ): Promise<Result<FirebaseAuthUser, Error>> {
    return new Promise((resolve, reject) => {
      const provider = AuthProvider[providerType];
      if (!provider) {
        resolve(
          Result.fail(
            Error(`Invalid Provider: ${providerType} is not supported.`)
          )
        );
        return;
      }

      return this._auth
        .signInWithPopup(provider)
        .then(async (credential) => {
          const user = await this._createUserFromCredential(credential);
          return resolve(user);
        })
        .catch((err) => {
          const result = Result.fail<User, Error>(err);
          return resolve(result);
        });
    });
  }

  private async _createUserFromCredential(
    credential: firebase.auth.UserCredential
  ): Promise<Result<FirebaseAuthUser, Error>> {
    if (!credential || !credential.user) {
      return Result.fail(new Error("No User found with those credentials"));
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
