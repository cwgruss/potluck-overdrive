import { FirestoreDocument } from 'src/firestore/firestore-collection.model';

export class UserDocument extends FirestoreDocument {
  static COLLECTION = 'users';
}
