import { Recipe } from '../domain/recipe.model';
import { RecipeData } from '../entities/recipe.entity';
import { Timestamp } from 'firebase/firestore';
import { Result } from 'src/core/monads/result';
import { IngredientMap } from 'src/ingredients/mappers/ingredient.mapper';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export class RecipeMapper {
  static toPersistance(recipe: Recipe): RecipeData {
    const ingredients = recipe.ingredients.map((ingredient) => {
      return IngredientMap.toPersistance(ingredient);
    });
    return {
      uuid: recipe.uuid.toString(),
      label: recipe.label || '',
      date_created: Timestamp.fromDate(recipe.dateCreated),
      is_vegetarian: recipe.isVegetarian(),
      ingredients,
    };
  }

  static toDomain(data: unknown & RecipeData): Result<Recipe, Error> {
    const { ingredients: rawIngredients, label, date_created } = data;
    const ingredients = rawIngredients.map((ingredient) => {
      const ingredientOrError = IngredientMap.toDomain(ingredient);
      if (!ingredientOrError.isFail()) {
        return ingredientOrError.unwrap();
      }
    });
    const recipeOrError = Recipe.create(
      {
        ingredients,
        label,
        dateCreated: date_created?.toDate(),
      },
      new UniqueEntityID(data.uuid),
    );

    return recipeOrError;
  }
}
