import { injectable } from "inversify";
import store from "../store";
import { IngredientActions } from "./ingredients.actions";

@injectable()
export class IngredientsVueXStateProxy {
  addIngredient(ingredient: string): Promise<void> {
    return new Promise((resolve, reject) => {
      store.dispatch(IngredientActions.ADD_INGREDIENT, { ingredient });
      resolve();
    });
  }

  popIngredient(): Promise<string> {
    const lastElement = store.dispatch(IngredientActions.POP_INGREDIENT);
    return lastElement;
  }
}
