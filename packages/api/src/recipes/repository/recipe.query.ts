import {
  where,
  orderBy,
  QueryConstraint,
  Query,
  DocumentData,
  query as FirebaseQuery,
} from 'firebase/firestore';
import { Ingredient } from 'src/ingredients/domain/ingredient.model';

export const RecipeContext = {
  query(
    q: Query<DocumentData>,
    ...constraints: QueryConstraint[]
  ): Query<DocumentData> {
    const queryConstraints = constraints.filter((v) => !!v);
    return FirebaseQuery(q, ...queryConstraints);
  },

  Where: {
    RandomSeedIsGreaterThan: function (randomIndex: number): QueryConstraint {
      return where('random_seed', '>=', randomIndex);
    },

    IngredientHasIndex: function (): QueryConstraint {
      return orderBy('index');
    },

    IngredientIDIsNotInArray: function (
      ingredientsToExclude: Ingredient[],
    ): QueryConstraint {
      if (!ingredientsToExclude || !ingredientsToExclude.length) {
        return;
      }

      const exludedIngredientIds = ingredientsToExclude.map(
        (ingredient) => ingredient.uuid,
      );

      return where('id', 'not-in', exludedIngredientIds);
    },
  },

  OrderBy: {
    RandomSeed: function (): QueryConstraint {
      return orderBy('random_seed');
    },

    Priority: function (): QueryConstraint {
      return orderBy('priority');
    },
  },
};
