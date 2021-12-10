import { AggregateRoot } from '@nestjs/cqrs';
import { Ingredient } from 'src/ingredients/domain/ingredient.model';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { IRecipe } from './recipe.interface';
import { filter } from 'lodash';
import { Result } from 'src/core/monads/result';

interface RecipeProps {
  ingredients: Ingredient[];
}

export class Recipe extends AggregateRoot implements IRecipe {
  get ingredients(): Ingredient[] {
    return this._ingredients;
  }
  private _ingredients: Ingredient[] = [];

  get ingredientCount(): number {
    return this._ingredients.length;
  }

  get uuid(): UniqueEntityID {
    return this._uuid;
  }
  private _uuid: UniqueEntityID;

  private constructor(props: RecipeProps, uuid?: UniqueEntityID) {
    super();
    this._ingredients = props.ingredients;
    this._uuid = uuid ? uuid : new UniqueEntityID();
  }

  public static create(): Result<Recipe, Error> {
    return Result.ok(
      new Recipe({
        ingredients: [],
      }),
    );
  }

  addIngredient(ingredient: Ingredient): void;
  addIngredient(ingredientId: UniqueEntityID): void;
  addIngredient(ingredient: any): void {
    if (ingredient instanceof Ingredient) {
      this._ingredients.push(ingredient);
    }

    if (ingredient instanceof UniqueEntityID) {
    }
  }

  addIngredients(...ingredients: Ingredient[]): void {
    return ingredients.forEach((ingredient) => {
      if (!this.containsIngredient(ingredient)) {
        this.addIngredient(ingredient);
      }
    });
  }

  removeIngredient(ingredient: Ingredient): void;
  removeIngredient(ingredientId: UniqueEntityID): void;
  removeIngredient(ingredient: any): void {
    let updatedIngredients;

    if (ingredient instanceof Ingredient) {
      updatedIngredients = filter(this._ingredients, (value) => {
        return value.id.equals(ingredient.id);
      });
    }

    if (ingredient instanceof UniqueEntityID) {
      updatedIngredients = filter(this._ingredients, (value) => {
        return value.id.equals(ingredient);
      });
    }

    this._ingredients = updatedIngredients;
  }

  public containsIngredient(ingredient: Ingredient): boolean {
    const ingredientIdx = this._ingredients.findIndex((item) => {
      return item.id.equals(ingredient.id);
    });
    return ingredientIdx > -1;
  }

  public toJSON() {
    const ingredients = this.ingredients.map((i) => i.toJSON());
    return {
      id: this.uuid,
      ingredients,
    };
  }
}
