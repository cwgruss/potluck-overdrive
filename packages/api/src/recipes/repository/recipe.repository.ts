import { Inject } from '@nestjs/common';
import {
  CollectionReference,
  DocumentData,
  getDocs,
  limit,
  Query,
  QuerySnapshot,
} from 'firebase/firestore';
import { Random } from 'src/core/monads/util/random';
import { Ingredient } from 'src/ingredients/domain/ingredient.model';
import { IngredientMap } from 'src/ingredients/mappers/ingredient.mapper';
import { IngredientDocument } from 'src/shared/infrastructure/firestore/documents/ingredient.document';
import { Recipe } from '../domain/recipe.model';
import { RecipeContext } from './recipe.query';

export abstract class IRecipeRepository {
  abstract createRecipeWithRandomIngredients(
    numberOfIngredients: number,
  ): Promise<Recipe>;
}

export class RecipeRepository implements IRecipeRepository {
  constructor(
    @Inject(IngredientDocument.COLLECTION)
    private _ingredientCollection: CollectionReference<DocumentData>,
  ) {}

  async createRecipeWithRandomIngredients(
    numberOfIngredients: number = 3,
    correctiveMultiplier: number = 1.2,
  ): Promise<Recipe> {
    const result = Recipe.create();
    if (result.isFail()) {
      //TODO: Fail with error
      return;
    }

    const newRecipe = result.unwrap();
    const correctedIngredientCount = Math.ceil(
      numberOfIngredients * correctiveMultiplier,
    );

    const ingredients = await this._getRandomIngredients(
      correctedIngredientCount,
    );
    const ingredientsToAdd = ingredients.slice(0, numberOfIngredients);
    newRecipe.addIngredients(...ingredientsToAdd);
    return newRecipe;
  }

  private async _getRandomIngredients(
    numberOfIngredients: number,
  ): Promise<Ingredient[]> {
    try {
      const querySnapshot = await this._queryRandomIngredients({
        limit: numberOfIngredients,
      });
      const ingredients = querySnapshot.docs.map((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const result = IngredientMap.toDomain(data);
          if (result.isFail()) {
            // TODO: throw an error
          }
          return result.unwrap();
        }
      });

      return ingredients;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async _queryRandomIngredients({
    limit,
    excludededIngredients = [],
  }: {
    limit: number;
    excludededIngredients?: Ingredient[];
  }): Promise<QuerySnapshot<DocumentData>> {
    let randomIndex = Random.generateRandomSeed();
    let queryRef: Query<DocumentData>,
      querySnapshot: QuerySnapshot,
      size: number;
    const NUMBER_OF_TRIES = 3;

    let iter = 0;

    do {
      queryRef = this._buildRandomIngredientQuery({
        ingredientLimit: limit,
        random: randomIndex,
        exclude: excludededIngredients,
      });
      querySnapshot = await getDocs(queryRef);
      size = querySnapshot.size;
      randomIndex =
        iter + 1 === NUMBER_OF_TRIES ? null : Random.generateRandomSeed();
      iter++;
    } while (size < limit && iter <= NUMBER_OF_TRIES);

    return querySnapshot;
  }

  private _buildRandomIngredientQuery({
    ingredientLimit = 1,
    random,
    exclude = [],
  }: {
    ingredientLimit: number;
    random: number;
    exclude?: Ingredient[];
  }): Query<DocumentData> {
    const randomIndex = random ? random : Random.RANDOM_INDEX_MIN;
    const queryRef = RecipeContext.query(
      this._ingredientCollection,
      RecipeContext.Where.RandomSeedIsGreaterThan(randomIndex),
      RecipeContext.Where.IngredientIDIsNotInArray(exclude),
      RecipeContext.OrderBy.RandomSeed(),
      RecipeContext.OrderBy.Priority(),
      RecipeContext.Where.IngredientHasIndex(),
      limit(ingredientLimit),
    );
    return queryRef;
  }
}
