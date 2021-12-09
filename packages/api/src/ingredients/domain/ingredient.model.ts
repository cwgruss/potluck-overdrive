import { Entity } from 'src/shared/domain/Entity';
import { Result } from 'src/core/monads/result';
import { Label } from 'src/shared/domain/label/Label.model';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { randomInt } from 'src/core/monads/util/random';

interface IngredientProps {
  priority: number;
  label: Label;
  description?: string;
  dateCreated?: Date;
  isVegetarian: boolean;
  randomSeed?: number;
}

export class Ingredient extends Entity<IngredientProps> {
  static RANDOM_INDEX_MIN = 1;
  static RANDOM_INDEX_MAX = 1_000_000_000;

  get id(): UniqueEntityID {
    return this._id;
  }

  get label(): Label {
    return this.props.label;
  }

  get priority(): number {
    return this.props.priority;
  }

  get description(): string {
    return this.props.description;
  }

  get dateCreated(): Date {
    return this.props.dateCreated;
  }

  get isVegetarian(): boolean {
    return this.props.isVegetarian;
  }

  get randomSeedIndex(): number {
    return this._randomSeedIndex;
  }
  private _randomSeedIndex;

  private constructor(props: IngredientProps, id?: UniqueEntityID) {
    super(props, id);
    this._randomSeedIndex = props.randomSeed
      ? props.randomSeed
      : this._seedRandomIndex();
  }

  public static create(
    props: IngredientProps,
    id?: UniqueEntityID,
  ): Result<Ingredient, Error> {
    const ingredient = new Ingredient(
      {
        ...props,
        dateCreated: props.dateCreated
          ? props.dateCreated
          : new Date(Date.now()),
        isVegetarian: props.isVegetarian || false,
      },
      id,
    );
    return Result.ok(ingredient);
  }

  public generateNewRandomSeed(): void {
    const random = randomInt(
      Ingredient.RANDOM_INDEX_MIN,
      Ingredient.RANDOM_INDEX_MAX,
    );
    this._randomSeedIndex = random;
  }

  public toJSON() {
    return {
      label: this.label.value,
      description: this.description,
      priority: this.priority,
      dateCreated: this.dateCreated.toISOString(),
      vegetarian: this.isVegetarian,
      random: this.randomSeedIndex,
    };
  }

  private _seedRandomIndex(): number {
    const random = randomInt(
      Ingredient.RANDOM_INDEX_MIN,
      Ingredient.RANDOM_INDEX_MAX,
    );
    return 544790844;
  }
}
