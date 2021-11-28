import { injectable } from "inversify";
import store from "../store";
import { AccountActions } from "./account.actions";
import { User } from "@/shared/api/domain/models/user/User";
import { AccountService } from "@/modules/account";
import { Maybe } from "@/shared/core/monads/maybe/maybe";
import { Result } from "@/shared/core/monads/result";
import { FirebaseAuthUser } from "@/shared/api/domain/models/user/FirebaseUser";
import SlackAuthUser from "@/shared/api/domain/models/user/SlackUser";

@injectable()
export class AccountVueXStateProxy {
  constructor(private _account: AccountService) {}

  getCurrentUser(): Promise<Result<User, Error>> {
    return new Promise((resolve, reject) => {
      const result = this._account.getCurrentUser();
      resolve(result);
    });
  }

  signInWithGoogle(): Promise<Result<User, Error>> {
    return store.dispatch(AccountActions.SIGN_IN_WITH_GOOGLE);
  }

  signInWithEmailAndPassword(
    emailAddress: string,
    password: string
  ): Promise<Result<FirebaseAuthUser, Error>> {
    return store.dispatch(AccountActions.SIGN_IN_WITH_EMAIL_AND_PASSWORD, {
      emailAddress,
      password,
    });
  }

  signInWithSlack(code: string): Promise<Result<SlackAuthUser, Error>> {
    return store.dispatch(AccountActions.SIGN_IN_WITH_SLACK, { code });
  }

  signOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      store.dispatch(AccountActions.SIGN_OUT);
      resolve();
    });
  }
}
