import { Result } from "@/shared/core/monads/result";
import { FirebaseAuthUser } from "../models/user/FirebaseUser";
import { FirebaseAuthProviderTypes } from "../repositories/AuthProvider.interface";

export interface FirebaseAuthentication {
  /**
   *
   * @param emailAddress The user's email address.
   * @param password The user's password
   */
  registerUserWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<Result<FirebaseAuthUser, Error>>;

  /**
   * Asynchronously signs in using an email and password.
   * Fails with an error if the email address and password do not match.
   * @param emailAddress The user's email address
   * @param password The user's password
   */
  signInWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<Result<FirebaseAuthUser, Error>>;

  /**
   * Authenticates a Firebase client using a popup-based OAuth authentication flow.
   * @param provider
   */
  signInWithPopUp(
    provider: FirebaseAuthProviderTypes
  ): Promise<Result<FirebaseAuthUser, Error>>;
}

export interface OAuthAPIAuthentication<T, E> {
  readonly _OAuthAPIURL: string;
  getBearerToken(): Promise<string>;
  signWithToken(token: string): Promise<Result<T, E>>;
}
