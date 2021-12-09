import { Timestamp } from 'firebase/firestore';
import { Result } from 'src/core/monads/result';
import { Label } from 'src/shared/domain/label/Label.model';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Ingredient } from '../domain/ingredient.model';
import { IngredientFirestoreEntity } from '../entities/ingredient.interface';

export class IngredientMap {
  static toPersistance(ingredient: Ingredient): IngredientFirestoreEntity {
    return {
      label: ingredient.label.value,
      description: ingredient.description || '',
      priority: ingredient.priority || 0,
      key_value: ingredient.label.keyValue,
      date_created: Timestamp.fromDate(ingredient.dateCreated),
      is_vegetarian: ingredient.isVegetarian,
      random_seed: ingredient.randomSeedIndex,
    };
  }

  static toDomain(
    data: unknown & Partial<IngredientFirestoreEntity>,
  ): Result<Ingredient, Error> {
    const labelOrError = Label.create({
      label: data.label,
    });

    if (labelOrError.isFail()) {
      return Result.fail(labelOrError.unwrapFail());
    }

    const ingredientOrError = Ingredient.create(
      {
        label: labelOrError.unwrap(),
        priority: data.priority,
        description: data.description,
        isVegetarian: data.is_vegetarian,
        dateCreated: data?.date_created?.toDate(),
      },
      new UniqueEntityID(data.id),
    );

    if (ingredientOrError.isFail()) {
      console.error(ingredientOrError.unwrapFail());
      return null;
    }

    return ingredientOrError;
  }
}
