import {
  where,
  orderBy,
  QueryConstraint,
  Query,
  DocumentData,
  query as FirebaseQuery,
} from 'firebase/firestore';
import { FieldPath, documentId } from 'firebase/firestore';

export const IngredientContext = {
  query(
    q: Query<DocumentData>,
    ...constraints: QueryConstraint[]
  ): Query<DocumentData> {
    const queryConstraints = constraints.filter((v) => !!v);
    return FirebaseQuery(q, ...queryConstraints);
  },

  Where: {
    IngredientSeedIsGreaterThan: function (
      randomIndex: number,
    ): QueryConstraint {
      return where('random_seed', '>=', randomIndex);
    },

    IngredientIDIs: function (ingredientID: string): QueryConstraint {
      if (!ingredientID || !ingredientID.length) {
        return;
      }

      return where(documentId(), '==', ingredientID);
    },

    IngredientIsVegetarian: function (): QueryConstraint {
      return where('is_vegetarian', '==', true);
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
