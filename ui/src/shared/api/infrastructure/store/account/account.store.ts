import { AccountService } from "@/modules/account";
import { FirebaseAuthUser } from "@/shared/api/domain/models/FirebaseUser";
import { TYPES } from "@/shared/providers";
import { getContainer } from "@/shared/providers/container";
import { inject, injectable } from "inversify";
import {
  VueXActionsFactoryMethod,
  VueXGettersFactoyMethod,
  VueXModuleFactory,
  VueXModuleFactoryMethod,
  VueXMutationsFactoryMethod,
  VueXStateFactoyMethod,
} from "../vuex.factory";

import { AccountCache } from "./account.cache";

enum AccountMutationTypes {
  SET_IS_SIGNED_IN = "SET_IS_SIGNED_IN",
}

export interface AccountState {
  status: string;
  /**
   * Whether the user has successfully signed in or not.
   */
  isSignedIn: boolean;

  token: string | null;

  user: {
    uid: string;
  } | null;
}

export interface RootState {
  account: AccountState;
}

const AUTH_REQUEST = "AUTH_REQUEST";
const AUTH_SUCCESS = "AUTH_SUCCESS";
const AUTH_ERROR = "AUTH_ERROR";
const AUTH_SIGN_OUT = "AUTH_SIGN_OUT";

@injectable()
class VueXAccountModule implements VueXModuleFactory<AccountState, RootState> {
  constructor(
    @inject(TYPES.AccountService) private _account: AccountService,
    @inject(TYPES.AccountCache) private _cache: AccountCache
  ) {}

  // State
  createInitialState: VueXStateFactoyMethod<AccountState> = () => {
    const initialState: AccountState = {
      status: "pending",
      isSignedIn: this._cache.getIsSignedIn(), // default to cached value to help prevent FOUC
      token: this._cache.getToken(),
      user: null,
    };

    return initialState;
  };

  createGetters: VueXGettersFactoyMethod<AccountState, RootState> = (
    state: AccountState
  ) => {
    const getters = {
      isSignedIn(): boolean {
        return state.isSignedIn;
      },

      user(): { uid: string } | null {
        return state.user;
      },
    };

    return getters;
  };

  createActions: VueXActionsFactoryMethod<AccountState, RootState> = () => {
    return {
      signInWithGoogle: ({ commit }): Promise<FirebaseAuthUser> => {
        return new Promise((resolve, reject) => {
          commit(AUTH_REQUEST);
          this._account
            .signInWithGoogle()
            .then((user) => {
              commit(AUTH_SUCCESS, {
                token: user.id.toString(),
                user,
              });
              resolve(user);
            })
            .catch((err) => {
              commit(AUTH_ERROR);
              reject(err);
            });
        });
      },
      signInWithSlack: ({ commit }, code: string): Promise<any> => {
        return new Promise((resolve, reject) => {
          commit(AUTH_REQUEST);
          this._account
            .signInWithSlack(code)
            .then((user) => {
              commit(AUTH_SUCCESS, {
                token: user.id.toString(),
                user,
              });
              resolve(user);
            })
            .catch((err) => {
              commit(AUTH_ERROR);
              reject(err);
            });
        });
      },
      signOut: ({ commit }): Promise<void> => {
        return this._account.signOut().then(() => {
          commit(AUTH_SIGN_OUT);
        });
      },
    };
  };

  createMutations: VueXMutationsFactoryMethod<AccountState> = (
    state: AccountState
  ) => {
    return {
      [AUTH_REQUEST]: (state: AccountState) => {
        state.status = "loading";
      },
      [AUTH_SUCCESS]: (
        state: AccountState,
        payload: { token: string; user: FirebaseAuthUser }
      ) => {
        this._cache.setIsSignedIn(true);
        this._cache.setToken(payload.token);
        state.status = "success";
        state.token = payload.token;
        state.user = {
          uid: payload.user.id.toString(),
        };
      },
      [AUTH_ERROR]: (state: AccountState) => {
        this._cache.clearAll();
        state.status = "error";
      },
      [AUTH_SIGN_OUT]: (state: AccountState) => {
        this._cache.clearAll();
        state.token = "";
        state.user = null;
        state.status = "logged-out";
        state.isSignedIn = false;
        this._cache.setIsSignedIn(false);
        this._cache.setToken(null);
      },
    };
  };

  createModule: VueXModuleFactoryMethod<AccountState, RootState> = () => {
    const state = this.createInitialState();
    const getters = this.createGetters(state);
    const actions = this.createActions(state);
    const mutations = this.createMutations(state);

    return {
      namespaced: true,
      state,
      getters,
      actions,
      mutations,
    };
  };
}

export const accountVueXModule = getContainer().resolve(VueXAccountModule);
