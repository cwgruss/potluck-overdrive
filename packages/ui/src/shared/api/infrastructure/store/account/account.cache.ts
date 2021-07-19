import { AbstractStorage } from "@/shared/core/storage/storage";
import { injectable } from "inversify";

enum AccountCacheKeys {
  IS_SIGNED_IN = "IS_SIGNED_IN",
  USER_JWT = "USER_JWT",
}

@injectable()
export class AccountCache extends AbstractStorage<AccountCacheKeys> {
  constructor() {
    super();
  }

  /**
   * isSignedIn
   */
  public getIsSignedIn(): boolean {
    const val = this.getItem(AccountCacheKeys.IS_SIGNED_IN) || "";
    return Boolean(val);
  }

  public setIsSignedIn(isSignedIn: boolean) {
    const bool = new Boolean(isSignedIn);
    this.setItem(AccountCacheKeys.IS_SIGNED_IN, bool.toString());
  }

  public setToken(token: string | null): void {
    if (!token) {
      this.clearItems([AccountCacheKeys.USER_JWT]);
      return;
    }
    this.setItem(AccountCacheKeys.USER_JWT, token);
  }

  public getToken(): string | null {
    return this.getItem(AccountCacheKeys.USER_JWT);
  }

  public clearAll() {
    this.clearItems([AccountCacheKeys.IS_SIGNED_IN]);
  }
}
