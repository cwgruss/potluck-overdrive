import {
  collection,
  Firestore,
  QueryDocumentSnapshot,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';

type FirestoreData = {
  uuid: string;
};

const Converter = <T extends FirestoreData>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    if (snap.exists()) {
      const uuid = snap.id;
      const data = snap.data();
      return {
        uuid,
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
