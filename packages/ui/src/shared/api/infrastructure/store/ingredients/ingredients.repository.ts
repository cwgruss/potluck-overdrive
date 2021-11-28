import { Ingredient } from "@/shared/api/domain/models/ingredient/Ingredient";
import { UserAddedIngredient } from "@/shared/api/domain/models/ingredient/UserAddedIngredient";
import { User } from "@/shared/api/domain/models/user/User";
import { injectable } from "inversify";
import { AccountVueXStateProxy } from "../account";
import store from "../store";
import { IngredientActions } from "./ingredients.actions";

@injectable()
export class IngredientsVueXStateProxy {
  constructor(private _account: AccountVueXStateProxy) {}

  addIngredient(ingredientName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._account.getCurrentUser().then((currentUser) => {
        if (currentUser.isFail()) {
          ("// TODO({1:scope}) User Is not logged in...fail hard");
          return;
        }
        const ingredient = UserAddedIngredient.create({
          name: ingredientName,
          addedBy: currentUser.unwrap(),
        });
        store.dispatch(IngredientActions.ADD_INGREDIENT, ingredient);
        resolve();
      });
    });
  }

  popIngredient(): Promise<Ingredient> {
    const lastElement = store.dispatch(IngredientActions.POP_INGREDIENT);
    return lastElement;
  }
}
