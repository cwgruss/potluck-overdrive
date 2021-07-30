import { AccountState } from "./account/account.store";
import { IngredientsState } from "./ingredients/ingredients.store";

export interface RootState {
  modules: { account: AccountState; ingredients: IngredientsState };
}
