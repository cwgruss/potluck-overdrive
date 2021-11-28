import { injectable } from "inversify";
import store from "../store";
import { AccountActions } from "./account.actions";
import { User } from "@/shared/api/domain/models/user/User";
import { AccountService } from "@/modules/account";
import { Maybe } from "@/shared/core/monads/maybe/maybe";
import { Result } from "@/shared/core/monads/result";

@injectable()
export class AccountVueXStateProxy {
  constructor(private _account: AccountService) {}

  getCurrentUser(): Promise<Result<User, Error>> {
    return new Promise((resolve, reject) => {
      const result = this._account.getCurrentUser();
      resolve(result);
    });
  }

  signInWithGoogle(): Promise<User> {
    return new Promise((resolve, reject) => {
      store
        .dispatch(AccountActions.SIGN_IN_WITH_GOOGLE)
        .then((result: Result<User, Error>) => {
          if (result.isFail()) {
            return reject(result.unwrapFail());
          }
          return resolve(result.unwrap());
        });
    });
  }

  signInWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      store.dispatch(AccountActions.SIGN_IN_WITH_EMAIL_AND_PASSWORD, {
        emailAddress,
        password,
      });
      resolve();
    });
  }

  signInWithSlack(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      store.dispatch(AccountActions.SIGN_IN_WITH_SLACK, { code });
      resolve();
    });
  }

  signOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      store.dispatch(AccountActions.SIGN_OUT);
      resolve();
    });
  }
}
