import { AccountService } from "@/modules/account";
import { FirebaseAuthUser } from "@/shared/api/domain/models/user/FirebaseUser";
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
import { RootState } from "../root";
import { AccountCache } from "./account.cache";
import { AccountStatus } from "./account.status";
import { Result } from "@/shared/core/monads/result";

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
      status: AccountStatus.PENDING,
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
        return state.isSignedIn || false;
      },

      getCurrentUser(): { uid: string } | null {
        if (!state.user) {
          return null;
        }
        return state.user;
      },
    };

    return getters;
  };

  createActions: VueXActionsFactoryMethod<AccountState, RootState> = () => {
    return {
      signInWithGoogle: ({
        commit,
      }): Promise<Result<FirebaseAuthUser, Error>> => {
        return new Promise((resolve, reject) => {
          commit(AUTH_REQUEST);
          this._account.signInWithGoogle().then((result) => {
            if (result.isFail()) {
              commit(AUTH_ERROR);
            } else {
              const user = result.unwrap();

              commit(AUTH_SUCCESS, {
                token: user.id.toString(),
                user,
              });
            }

            resolve(result);
          });
        });
      },
      signInWithSlack: (
        { commit },
        payload: { code: string }
      ): Promise<any> => {
        return new Promise((resolve, reject) => {
          commit(AUTH_REQUEST);
          this._account
            .signInWithSlack(payload.code)
            .then((result) => {
              if (result.isFail()) {
                commit(AUTH_ERROR);
              } else {
                const user = result.unwrap();
                commit(AUTH_SUCCESS, {
                  token: user.id.toString(),
                  user,
                });
              }

              resolve(result);
            })
            .catch((err) => {
              commit(AUTH_ERROR);
              reject(err);
            });
        });
      },
      signInWithEmailAndPassword: (
        { commit },
        payload: { emailAddress: string; password: string }
      ): Promise<Result<FirebaseAuthUser, Error>> => {
        return new Promise((resolve, reject) => {
          const { emailAddress, password } = payload;
          this._account
            .signInWithEmailAndPassword(emailAddress, password)
            .then((result) => {
              if (result.isFail()) {
                commit(AUTH_ERROR);
              } else {
                const user = result.unwrap();

                commit(AUTH_SUCCESS, {
                  token: user.id.toString(),
                  user,
                });
              }

              resolve(result);
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
        state.status = AccountStatus.LOADING;
      },
      [AUTH_SUCCESS]: (
        state: AccountState,
        payload: { token: string; user: FirebaseAuthUser }
      ) => {
        this._cache.setIsSignedIn(true);
        this._cache.setToken(payload.token);
        state.status = AccountStatus.SUCCESS;
        state.isSignedIn = true;
        state.token = payload.token;
        state.user = {
          uid: payload.user.id.toString(),
        };

        state.status = AccountStatus.LOGGED_IN;
      },
      [AUTH_ERROR]: (state: AccountState) => {
        this._cache.clearAll();
        state.status = AccountStatus.FAILURE;
      },
      [AUTH_SIGN_OUT]: (state: AccountState) => {
        this._cache.clearAll();
        state.token = "";
        state.user = null;
        state.status = AccountStatus.LOGGED_OUT;
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
