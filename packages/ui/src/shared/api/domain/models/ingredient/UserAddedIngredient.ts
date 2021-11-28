import { Maybe } from "@/shared/core/monads/maybe/maybe";
import { User } from "../user/User";
import { Ingredient, IngredientProps } from "./Ingredient";

interface IngredientPropsWithUser extends IngredientProps {
  addedBy: User;
}

export class UserAddedIngredient extends Ingredient {
  protected _addedByUser: Maybe<User> = Maybe.none();

  get addedByUser(): Maybe<User> {
    return this._addedByUser;
  }

  setAddedByUser(user: User): void {
    this._addedByUser = Maybe.fromValue(user);
  }

  protected constructor(props: IngredientProps, user: User) {
    super(props);
  }

  public static create(props: IngredientPropsWithUser): UserAddedIngredient {
    return new UserAddedIngredient(props, props.addedBy);
  }
}
