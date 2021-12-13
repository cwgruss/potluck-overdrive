import * as functions from 'firebase-functions';
import {db} from '../config';
import {getIncrement} from '../shared/util/getIncrement';

export const OnIngredientCreation = functions.firestore
  .document('Ingredients/{ingredientId}')
  .onCreate(async (snapshot, context) => {
    const counters = snapshot.ref.parent.parent?.collection('Counters');

    return db.runTransaction(async transaction => {
      const nextIngredientIndex = await getIncrement({
        transaction,
        path: counters,
        counterName: 'index',
      });
      transaction.update(snapshot.ref, {index: nextIngredientIndex});
    });
  });
