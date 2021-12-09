import { Inject } from '@nestjs/common';

import {
  DocumentData,
  query,
  where,
  getDocs,
  CollectionReference,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
  Firestore,
} from 'firebase/firestore';
import { Ingredient } from '../domain/ingredient.model';
import { IngredientDocument } from 'src/shared/infrastructure/firestore/documents/ingredient.document';
import { IngredientMap } from '../mappers/ingredient.mapper';
import { IndexDocument } from 'src/shared/infrastructure/firestore/documents/unqiue-index.document';
import { FirestoreDatabase } from 'src/shared/infrastructure/firestore/firestore.provider';

export abstract class IIngredientRepository {
  abstract findAllIngredients(): Promise<Ingredient[]>;
  abstract exists(keyValue: string): Promise<boolean>;
  abstract save(ingredient: Ingredient): Promise<void>;
}

export class IngredientRepository extends IIngredientRepository {
  static RANDOM_INDEX_PREFIX = 'Ingredients/random_seed';
  constructor(
    @Inject(IngredientDocument.COLLECTION)
    private _ingredientCollection: CollectionReference<DocumentData>,
    @Inject(IndexDocument.COLLECTION)
    private _indexCollection: CollectionReference<DocumentData>,
    @Inject(FirestoreDatabase) private _firestore: Firestore,
  ) {
    super();
  }

  async exists(keyValue: string): Promise<boolean> {
    const q = query(
      this._ingredientCollection,
      where('key_value', '==', keyValue),
    );
    const querySnapshot = getDocs(q);

    const exists = new Promise<boolean>((resolve, reject) => {
      querySnapshot
        .then((snapshot) => {
          const addressExists = !snapshot.empty;
          resolve(addressExists);
        })
        .catch((reason) => {
          reject(reason);
        });
    });

    return exists;
  }

  async save(ingredient: Ingredient): Promise<void> {
    const alreadyExists = await this.exists(ingredient.label.keyValue);
    let rawIngredient = IngredientMap.toPersistance(ingredient);

    if (!alreadyExists) {
      let isSeedUnique = await this._isRandomSeedUnique(ingredient);

      if (!isSeedUnique) {
        let i = 0;
        do {
          ingredient.generateNewRandomSeed();
          isSeedUnique = await this._isRandomSeedUnique(ingredient);
        } while (i <= 3 && !isSeedUnique);
      }

      rawIngredient = IngredientMap.toPersistance(ingredient);

      const batch = writeBatch(this._firestore);
      const newIngredientRef = doc(this._ingredientCollection);

      const indexRefName = `${IngredientRepository.RANDOM_INDEX_PREFIX}/${ingredient.randomSeedIndex}`;
      const ingredientIndexRef = doc(this._indexCollection, indexRefName);
      batch.set(newIngredientRef, rawIngredient);
      batch.set(ingredientIndexRef, {
        ref_value: newIngredientRef.id,
      });
      return await batch.commit();
    } else {
      const docRef = doc(this._ingredientCollection, ingredient.id.toString());

      // Don't update everything. Instead, update the
      // properties permitted to be overwritten
      await updateDoc(docRef, {
        label: rawIngredient.label,
        description: rawIngredient.description,
        priority: rawIngredient.priority,
        is_vegetarian: rawIngredient.is_vegetarian,
      });
    }

    return;
  }

  async findAllIngredients(): Promise<Ingredient[]> {
    const querySnapshot = await getDocs(this._ingredientCollection);
    const ingredients = querySnapshot.docs.map((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const ingredient = IngredientMap.toDomain(data);
        if (ingredient.isOk()) {
          return ingredient.unwrap();
        }
      }
    });
    return ingredients;
  }

  private async _isRandomSeedUnique(ingredient: Ingredient): Promise<boolean> {
    const indexRefName = `${IngredientRepository.RANDOM_INDEX_PREFIX}/${ingredient.randomSeedIndex}`;
    const ingredientIndexRef = doc(this._indexCollection, indexRefName);
    const snapshot = await getDoc(ingredientIndexRef);
    const alreadyExists = snapshot.exists();
    return !alreadyExists;
  }
}
