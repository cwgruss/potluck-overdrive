import { IngredientDocument } from './documents/ingredient.document';
import { RecipeDocument } from './documents/Recipe.document';
import { IndexDocument } from './documents/unqiue-index.document';
import { UserDocument } from './documents/user.document';

export const FirestoreDatabase = Symbol.for('FirestoreDB');
export const FirestoreOptionsProvider = Symbol.for('FirestoreOptions');

export const FirestoreCollectionProviders: string[] = [
  UserDocument.COLLECTION,
  IngredientDocument.COLLECTION,
  IndexDocument.COLLECTION,
  RecipeDocument.COLLECTION,
];
