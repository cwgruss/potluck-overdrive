import Vue from "vue";
import Vuex, { Module, Store } from "vuex";
import { accountVueXModule } from "./account/account.store";
import { ingredientsVueXModule } from "./ingredients/ingredients.store";

const debug = process.env.NODE_ENV !== "production";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    account: accountVueXModule.createModule(),
    ingredients: ingredientsVueXModule.createModule(),
  },
  strict: debug,
});
