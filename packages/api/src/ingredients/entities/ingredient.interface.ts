import { Timestamp } from 'firebase/firestore';

export interface IngredientFirestoreEntity {
  id?: string;
  priority: number;
  label: string;
  description?: string;
  key_value: string;
  date_created: Timestamp;
  is_vegetarian: boolean;
  random_seed: number;
}
