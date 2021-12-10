import { Entity } from 'src/shared/domain/Entity';
import { Result } from 'src/core/monads/result';
import { Label } from 'src/shared/domain/label/Label.model';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Random } from 'src/core/monads/util/random';

interface IngredientProps {
  index?: number;
  priority: number;
  label: Label;
  description?: string;
  dateCreated?: Date;
  isVegetarian: boolean;
  randomSeed?: number;
}

export class Ingredient extends Entity<IngredientProps> {
  get uuid(): UniqueEntityID {
    return this._uuid;
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

  get index(): number {
    return this._index;
  }
  private _index: number;

  private constructor(props: IngredientProps, uuid?: UniqueEntityID) {
    super(props, uuid);
    this._randomSeedIndex = props.randomSeed
      ? props.randomSeed
      : this.generateNewRandomSeed();
  }

  public static create(
    props: IngredientProps,
    uuid?: UniqueEntityID,
  ): Result<Ingredient, Error> {
    const ingredient = new Ingredient(
      {
        ...props,
        dateCreated: props.dateCreated
          ? props.dateCreated
          : new Date(Date.now()),
        isVegetarian: props.isVegetarian || false,
      },
      uuid,
    );
    return Result.ok(ingredient);
  }

  public generateNewRandomSeed(): number {
    this._randomSeedIndex = Random.generateRandomSeed();
    return this._randomSeedIndex;
  }

  public toJSON() {
    return {
      label: this.label.value,
      description: this.description,
      priority: this.priority,
      dateCreated: this.dateCreated.toISOString(),
      vegetarian: this.isVegetarian,
      index: this.index,
      random: this.randomSeedIndex,
    };
  }
}
