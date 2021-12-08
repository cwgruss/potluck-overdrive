export interface IngredientFirestoreEntity {
  id?: string;
  priority: number;
  label: string;
  description?: string;
  key_value: string;
}
