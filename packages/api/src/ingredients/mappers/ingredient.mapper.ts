import { Timestamp } from 'firebase/firestore';
import { Result } from 'src/core/monads/result';
import { Index } from 'src/shared/domain/index/Index.model';
import { Label } from 'src/shared/domain/label/Label.model';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Ingredient } from '../domain/ingredient.model';
import { IngredientData } from '../entities/ingredient.interface';

export class IngredientMap {
  static toPersistance(ingredient: Ingredient): IngredientData {
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
    data: unknown & Partial<IngredientData>,
  ): Result<Ingredient, Error> {
    const labelOrError = Label.create({
      label: data.label,
    });

    if (labelOrError.isFail()) {
      return Result.fail(labelOrError.unwrapFail());
    }

    const index = Index.create({ index: data.index });

    const ingredientOrError = Ingredient.create(
      {
        index,
        label: labelOrError.unwrap(),
        priority: data.priority,
        description: data.description,
        isVegetarian: data.is_vegetarian,
        dateCreated: data?.date_created?.toDate(),
        randomSeed: data.random_seed,
      },
      new UniqueEntityID(data.uuid),
    );

    if (ingredientOrError.isFail()) {
      console.error(ingredientOrError.unwrapFail());
      return null;
    }

    return ingredientOrError;
  }
}
