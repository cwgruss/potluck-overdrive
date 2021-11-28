import { Ingredient } from "@/shared/api/domain/models/ingredient/Ingredient";
import { injectable } from "inversify";
import store from "../store";
import { IngredientActions } from "./ingredients.actions";

@injectable()
export class IngredientsVueXStateProxy {
  addIngredient(ingredientName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const ingredient = Ingredient.create({ name: ingredientName });
      store.dispatch(IngredientActions.ADD_INGREDIENT, ingredient);
      resolve();
    });
  }

  popIngredient(): Promise<Ingredient> {
    const lastElement = store.dispatch(IngredientActions.POP_INGREDIENT);
    return lastElement;
  }
}
