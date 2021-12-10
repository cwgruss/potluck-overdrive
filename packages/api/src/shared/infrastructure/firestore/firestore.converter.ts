import {
  collection,
  Firestore,
  QueryDocumentSnapshot,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';

type FirestoreData = {
  id: string;
};

const Converter = <T extends FirestoreData>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    if (snap.exists()) {
      const id = snap.id;
      const data = snap.data();
      return {
        id,
        ...data,
      } as T;
    }
  },
});

export const NormalizedCollection = <T>(
  db: Firestore,
  collectionPath: string,
): CollectionReference<DocumentData> => {
  const dataSource = collection(db, collectionPath).withConverter(Converter());
  return dataSource;
};
