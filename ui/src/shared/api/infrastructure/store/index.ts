import Vue from "vue";
import Vuex, { Module, Store } from "vuex";
import { AccountState, accountVueXModule } from "./account/account.store";

const debug = process.env.NODE_ENV !== "production";

Vue.use(Vuex);

interface RootState {
  modules: { account: AccountState };
}

export default new Vuex.Store({
  modules: { account: accountVueXModule.createModule() },
  strict: debug,
});
