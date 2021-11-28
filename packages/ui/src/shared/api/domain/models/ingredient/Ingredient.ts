import { Entity } from "../../util/Entity";

export interface IngredientProps {
  name: string;
}

export class Ingredient extends Entity<IngredientProps> {
  protected constructor(props: IngredientProps) {
    super(props);
  }

  get name(): string {
    return this.props.name;
  }

  public static create(props: IngredientProps): Ingredient {
    return new Ingredient(props);
  }

  toString(): string {
    throw new Error("Method not implemented.");
  }

  toJSON(): IngredientProps {
    return this.props;
  }

  fromJSON(props: IngredientProps) {
    return Ingredient.create(props) as this;
  }

  fromString(str: string) {
    const json = JSON.parse(str);
    return this.fromJSON(json) as this;
  }
}
