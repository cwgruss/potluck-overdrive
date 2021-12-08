import { Entity } from 'src/core/domain/Entity';
import { UniqueEntityID } from 'src/core/domain/UniqueEntityID';
import { Result } from 'src/core/monads/result';

interface IngredientProps {
  priority: number;
  label: string;
  description?: string;
}

export class Ingredient extends Entity<IngredientProps> {
  get keyValue(): string {
    return this._ingredientKey;
  }
  protected _ingredientKey: string;

  get id(): UniqueEntityID {
    return this._id;
  }

  get label(): string {
    return this.props.label;
  }

  get priority(): number {
    return this.props.priority;
  }

  get description(): string {
    return this.props.description;
  }

  private constructor(props: IngredientProps, id?: UniqueEntityID) {
    super(props, id);
    this._ingredientKey = this._createKeyFromLabel(this.props.label);
  }

  public static create(
    props: IngredientProps,
    id?: UniqueEntityID,
  ): Result<Ingredient, Error> {
    const ingredient = new Ingredient(props, id);
    return Result.ok(ingredient);
  }

  private _createKeyFromLabel(label: string): string {
    // 1. Remove starting and trailing whitespace
    let trimmedInput = label.trim();

    // 2. Replace all spaces with underscores
    trimmedInput = trimmedInput.replace(/\s/g, '_');
    // 3. Remove characters special to JSON
    trimmedInput = trimmedInput.replace(/[\b\f\n\r\t\"\\:]/, '');
    // 4. Force to uppercase
    return trimmedInput.toUpperCase();
  }
}
