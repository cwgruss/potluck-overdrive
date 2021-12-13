import { Ingredient } from 'src/ingredients/domain/ingredient.model';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export interface IRecipe {
  readonly ingredients: Ingredient[];

  addIngredient(ingredient: Ingredient): void;
  addIngredient(ingredientId: UniqueEntityID): void;

  removeIngredient(ingredient: Ingredient): void;
  removeIngredient(ingredientId: UniqueEntityID): void;
}
