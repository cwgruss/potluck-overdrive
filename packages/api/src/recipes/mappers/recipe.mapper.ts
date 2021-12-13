import { Recipe } from '../domain/recipe.model';
import { RecipeData } from '../entities/recipe.entity';
import { Timestamp } from 'firebase/firestore';

export class RecipeMapper {
  static toPersistance(recipe: Recipe): RecipeData {
    const ingredients = recipe.ingredients.map((ingredient) => {
      return ingredient.uuid.toString();
    });
    return {
      uuid: recipe.uuid.toString(),
      label: recipe.label || '',
      date_created: Timestamp.fromDate(recipe.dateCreated),
      is_vegetarian: false,
      ingredients,
    };
  }
}
