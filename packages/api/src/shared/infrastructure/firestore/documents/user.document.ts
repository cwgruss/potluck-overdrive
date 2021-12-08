import { FirestoreDocument } from 'src/shared/infrastructure/firestore/firestore-collection.model';

export class UserDocument extends FirestoreDocument {
  static COLLECTION = 'users';
}
