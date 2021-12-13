import { Timestamp } from 'firebase/firestore';
import { IngredientData } from 'src/ingredients/entities/ingredient.interface';

export class RecipeData {
  uuid?: string;
  label: string;
  date_created: Timestamp;
  is_vegetarian: boolean;
  ingredients: IngredientData[];
}
