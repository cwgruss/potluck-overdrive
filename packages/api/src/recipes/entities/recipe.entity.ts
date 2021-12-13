import { Timestamp } from 'firebase/firestore';

export class RecipeData {
  uuid?: string;
  label: string;
  date_created: Timestamp;
  is_vegetarian: boolean;
  ingredients: string[];
}
