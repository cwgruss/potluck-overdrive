import * as firebase from 'firebase-admin';
import {db} from '../../config';

const defaultCollectionPath = 'Counters';

export interface incrementParams {
  transaction: firebase.firestore.Transaction;
  counterName: string;
  path?: firebase.firestore.CollectionReference;
  startAt?: number;
  incrementValue?: number;
}

/**
 * Returns the next incremental index
 * @param {incrementParams} args
 * @return {number}
 */
export async function getIncrement(args: incrementParams): Promise<number> {
  let result = args.startAt ?? 1;
  const counterRef = args.path
    ? args.path.doc(args.counterName)
    : db.doc(`${defaultCollectionPath}/${args.counterName}`);

  const counterDoc = await args.transaction.get<any>(counterRef);

  if (counterDoc.exists) {
    const {counterValue} = counterDoc.data();
    result = counterValue + (args.incrementValue ?? 1);
    args.transaction.update(counterRef, {counterValue: result});
  } else {
    const counterValue = result;
    args.transaction.create(counterRef, {counterValue});
  }

  return result;
}
