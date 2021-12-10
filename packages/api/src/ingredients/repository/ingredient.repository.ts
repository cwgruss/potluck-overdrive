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
  limit,
  writeBatch,
  Firestore,
} from 'firebase/firestore';
import { Ingredient } from '../domain/ingredient.model';
import { IngredientDocument } from 'src/shared/infrastructure/firestore/documents/ingredient.document';
import { IngredientMap } from '../mappers/ingredient.mapper';
import { IndexDocument } from 'src/shared/infrastructure/firestore/documents/unqiue-index.document';
import { FirestoreDatabase } from 'src/shared/infrastructure/firestore/firestore.provider';
import { IngredientContext } from './ingredient.query';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Result } from 'src/core/monads/result';

export abstract class IIngredientRepository {
  abstract findAllIngredients(): Promise<Ingredient[]>;
  abstract findIngredientByID(
    ingredientUUID: UniqueEntityID,
  ): Promise<Result<Ingredient, Error>>;
  abstract exists(keyValue: string): Promise<boolean>;
  abstract hasIngredientWithID(
    ingredientUUID: UniqueEntityID,
  ): Promise<boolean>;
  abstract createIngredient(ingredient: Ingredient): Promise<void>;
  abstract updateIngredient(
    uuid: UniqueEntityID,
    ingredient: Ingredient,
  ): Promise<Result<Ingredient, Error>>;
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

  hasIngredientWithID(ingredientUUID: UniqueEntityID): Promise<boolean> {
    const uuid = ingredientUUID.toString();
    const q = IngredientContext.query(
      this._ingredientCollection,
      IngredientContext.Where.IngredientIDIs(uuid),
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

  async createIngredient(ingredient: Ingredient): Promise<void> {
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
    }
  }

  async updateIngredient(
    uuid: UniqueEntityID,
    ingredient: Ingredient,
  ): Promise<Result<Ingredient, Error>> {
    const alreadyExists = await this.hasIngredientWithID(uuid);
    if (!alreadyExists) {
      throw new Error(`Ingredient with UUID "${uuid}" does not exist.`);
    }

    let rawIngredient = IngredientMap.toPersistance(ingredient);
    const docRef = doc(this._ingredientCollection, uuid.toString());

    // Don't update everything. Instead, update the
    // properties permitted to be overwritten
    await updateDoc(docRef, {
      label: rawIngredient.label,
      description: rawIngredient.description,
      priority: rawIngredient.priority,
      is_vegetarian: rawIngredient.is_vegetarian,
    });

    const updatedIngredient = this.findIngredientByID(uuid);
    return updatedIngredient;
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

  async findIngredientByID(
    ingredientUUID: UniqueEntityID,
  ): Promise<Result<Ingredient, Error>> {
    const uuid = ingredientUUID.toString();
    const q = IngredientContext.query(
      this._ingredientCollection,
      IngredientContext.Where.IngredientIDIs(uuid),
      limit(1),
    );

    const querySnapshot = getDocs(q);

    const ingredient = new Promise<Result<Ingredient, Error>>(
      (resolve, reject) => {
        querySnapshot
          .then((snapshot) => {
            const exists = !snapshot.empty;
            if (!exists) {
            }
            const data = snapshot.docs[0].data();
            const ingredient = IngredientMap.toDomain(data);
            resolve(ingredient);
          })
          .catch((reason) => {
            reject(reason);
          });
      },
    );

    return ingredient;
  }

  private async _isRandomSeedUnique(ingredient: Ingredient): Promise<boolean> {
    const indexRefName = `${IngredientRepository.RANDOM_INDEX_PREFIX}/${ingredient.randomSeedIndex}`;
    const ingredientIndexRef = doc(this._indexCollection, indexRefName);
    const snapshot = await getDoc(ingredientIndexRef);
    const alreadyExists = snapshot.exists();
    return !alreadyExists;
  }
}
