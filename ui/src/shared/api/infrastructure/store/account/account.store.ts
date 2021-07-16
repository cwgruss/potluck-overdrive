import { AccountService } from "@/modules/account";
import { FirebaseAuthUser } from "@/shared/api/domain/models/FirebaseUser";
import { TYPES } from "@/shared/providers";
import { getContainer } from "@/shared/providers/container";
import { inject, injectable } from "inversify";
import { Module, MutationTree } from "vuex";
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

  // getters
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
    const service = this._account;
    const cache = this._cache;
    return {
      sign_in_with_google({ commit }): Promise<FirebaseAuthUser> {
        return new Promise((resolve, reject) => {
          commit("auth_request");
          service
            .signInWithGoogle()
            .then((user) => {
              commit("auth_success", {
                token: user.id.toString(),
                user,
              });
              resolve(user);
            })
            .catch((err) => {
              commit("auth_error");
              reject(err);
            });
        });
      },
    };
  };

  createMutations: VueXMutationsFactoryMethod<AccountState> = (
    state: AccountState
  ) => {
    const cache = this._cache;
    return {
      auth_request(state: AccountState) {
        state.status = "loading";
      },
      auth_success(
        state: AccountState,
        payload: { token: string; user: FirebaseAuthUser }
      ) {
        cache.setIsSignedIn(true);
        cache.setToken(payload.token);
        state.status = "success";
        state.token = payload.token;
        state.user = {
          uid: payload.user.id.toString(),
        };
      },
      auth_error(state: AccountState) {
        cache.clear();
        state.status = "error";
      },
    };
  };

  createModule: VueXModuleFactoryMethod<AccountState, RootState> = () => {
    const state = this.createInitialState();
    const getters = this.createGetters(state);
    const actions = this.createActions();
    const mutations = this.createMutations(state);

    return {
      state,
      getters,
      actions,
      mutations,
    };
  };
}

// actions
// const createAccountActions: VueXActionsFactoryMethod<AccountState, RootState> =
//   () => {
//     const actions = {};
//     return actions;
//   };

// mutations
// interface AccountMutations {
//   [AccountMutationTypes.SET_IS_SIGNED_IN](
//     state: AccountState,
//     isSignedIn: boolean
//   ): void;
// }
// const createAccountMutations: VueXMutationsFactoryMethod<AccountState> = () => {
//   const mutations: MutationTree<AccountState> & AccountMutations = {
//     [AccountMutationTypes.SET_IS_SIGNED_IN](
//       state: AccountState,
//       isSignedIn: boolean
//     ): void {
//       state.isSignedIn = isSignedIn;
//     },
//   };

//   return mutations;
// };

export const accountVueXModule = getContainer().resolve(VueXAccountModule);
