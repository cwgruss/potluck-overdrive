import { Entity } from 'src/shared/domain/Entity';
import { Result } from 'src/core/monads/result';
import { Label } from 'src/shared/domain/label/Label.model';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

interface IngredientProps {
  priority: number;
  label: Label;
  description?: string;
  dateCreated?: Date;
  isVegetarian: boolean;
}

export class Ingredient extends Entity<IngredientProps> {
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

  private constructor(props: IngredientProps, id?: UniqueEntityID) {
    super(props, id);
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

  public toJSON() {
    return {
      label: this.label.value,
      description: this.description,
      priority: this.priority,
      dateCreated: this.dateCreated.toISOString(),
      vegetarian: this.isVegetarian,
    };
  }
}
