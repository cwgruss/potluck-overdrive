import { UniqueEntityID } from 'src/core/domain/UniqueEntityID';
import { Ingredient } from '../domain/ingredient.model';
import { IngredientFirestoreEntity } from '../entities/ingredient.interface';

export class IngredientMap {
  static toPersistance(ingredient: Ingredient): IngredientFirestoreEntity {
    return {
      label: ingredient.label,
      description: ingredient.description || '',
      priority: ingredient.priority || 0,
      key_value: ingredient.keyValue,
    };
  }

  static toDomain(
    data: unknown & Partial<IngredientFirestoreEntity>,
  ): Ingredient {
    const ingredientOrError = Ingredient.create(
      {
        label: data.label,
        priority: data.priority,
        description: data.description,
      },
      new UniqueEntityID(data.id),
    );

    if (ingredientOrError.isFail()) {
      console.error(ingredientOrError.unwrapFail());
      return null;
    }

    return ingredientOrError.unwrap();
  }
}
