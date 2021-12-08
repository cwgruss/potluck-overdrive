import { Inject } from '@nestjs/common';

import {
  DocumentData,
  query,
  where,
  getDocs,
  CollectionReference,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Ingredient } from '../domain/ingredient.model';
import { IngredientDocument } from 'src/shared/infrastructure/firestore/documents/ingredient.document';
import { IngredientMap } from '../mappers/ingredient.mapper';

export abstract class IIngredientRepository {
  abstract findAllIngredients(): Promise<Ingredient[]>;
  abstract exists(keyValue: string): Promise<boolean>;
  abstract save(ingredient: Ingredient): Promise<void>;
}

export class IngredientRepository extends IIngredientRepository {
  constructor(
    @Inject(IngredientDocument.COLLECTION)
    private _ingredientCollection: CollectionReference<DocumentData>,
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
    const rawIngredient = IngredientMap.toPersistance(ingredient);

    try {
      if (!alreadyExists) {
        const newIngredientDoc = doc(this._ingredientCollection);
        setDoc(newIngredientDoc, rawIngredient);
      } else {
        const docRef = doc(
          this._ingredientCollection,
          ingredient.id.toString(),
        );

        // Don't update everything. Instead, update the
        // properties permitted to be overwritten
        await updateDoc(docRef, {
          label: rawIngredient.label,
          description: rawIngredient.description,
          priority: rawIngredient.priority,
          is_vegetarian: rawIngredient.is_vegetarian,
        });
      }
    } catch (error) {
      console.error(error);
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
}
