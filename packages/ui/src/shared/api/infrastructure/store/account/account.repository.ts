import { injectable } from "inversify";
import store from "../store";
import { AccountActions } from "./account.actions";

@injectable()
export class AccountVueXStateProxy {
  signInWithGoogle(): Promise<void> {
    return new Promise((resolve, reject) => {
      store.dispatch(AccountActions.SIGN_IN_WITH_GOOGLE);
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
