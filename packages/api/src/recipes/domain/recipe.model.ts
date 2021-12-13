import { AggregateRoot } from '@nestjs/cqrs';
import { Ingredient } from 'src/ingredients/domain/ingredient.model';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { IRecipe } from './recipe.interface';
import { filter } from 'lodash';
import { Result } from 'src/core/monads/result';
import { IndexHashMap } from 'src/shared/domain/index/IndexHashMap.model';
import { Index } from 'src/shared/domain/index/Index.model';

interface RecipeProps {
  ingredients: Ingredient[];
  label?: string;
  dateCreated?: Date;
}

export class Recipe extends AggregateRoot implements IRecipe {
  get ingredients(): Ingredient[] {
    return this._ingredients;
  }
  private _ingredients: Ingredient[] = [];

  get label(): string {
    return this._label;
  }
  private _label: string;

  get dateCreated(): Date {
    return this._dateCreated;
  }
  private _dateCreated: Date;

  private _ingredientHashMap: IndexHashMap<Index>;

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
    this._label = props.label;
    this._dateCreated = props.dateCreated;
    const indexes = this._ingredients.map((item) => item.index);
    this._ingredientHashMap = new IndexHashMap(indexes);
  }

  public static create(props: RecipeProps): Result<Recipe, Error> {
    return Result.ok(
      new Recipe({
        ingredients: [],
        dateCreated: props.dateCreated
          ? props.dateCreated
          : new Date(Date.now()),
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

    const indexes = this._ingredients.map((item) => item.index);
    this._ingredientHashMap = new IndexHashMap(indexes);
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
        return value.uuid.equals(ingredient.uuid);
      });
    }

    if (ingredient instanceof UniqueEntityID) {
      updatedIngredients = filter(this._ingredients, (value, idx) => {
        return value.uuid.equals(ingredient);
      });
    }

    this._ingredients = updatedIngredients;
    const indexes = this._ingredients.map((item) => item.index);
    this._ingredientHashMap = new IndexHashMap(indexes);
  }

  public containsIngredient(ingredient: Ingredient): boolean {
    const ingredientIdx = this._ingredients.findIndex((item) => {
      return item.uuid.equals(ingredient.uuid);
    });
    return ingredientIdx > -1;
  }

  public toJSON() {
    const ingredients = this.ingredients.map((i) => i.toJSON());
    const hash = this._ingredientHashMap.toHashCode();
    return {
      uuid: this.uuid,
      ingredients,
      hash_code: hash,
    };
  }
}
