import * as functions from 'firebase-functions';
import {db} from '../config';
import {getIncrement} from '../shared/util/getIncrement';

export const OnIngredientUpdate = functions.firestore
  .document('Ingredients/{ingredientId}')
  .onUpdate(async (snapshot, context) => {
    const counters = snapshot.before.ref.parent.parent?.collection('Counters');
    const ingredientBeforeRef = snapshot.before;

    const ingredientBeforeData = ingredientBeforeRef.data();
    if (typeof ingredientBeforeData.index !== 'undefined') {
      return;
    }

    return db.runTransaction(async transaction => {
      const nextIngredientIndex = await getIncrement({
        transaction,
        path: counters,
        counterName: 'index',
      });
      transaction.update(snapshot.after.ref, {index: nextIngredientIndex});
    });
  });
