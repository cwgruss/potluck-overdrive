import { UserDocument } from './documents/user.document';

export const FirestoreDatabaseProvider = Symbol.for('FirestoreDB');
export const FirestoreOptionsProvider = Symbol.for('FirestoreOptions');
export const FirestoreCollectionProviders: string[] = [UserDocument.COLLECTION];