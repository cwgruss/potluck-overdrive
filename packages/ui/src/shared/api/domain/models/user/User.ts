import { Result } from "@/shared/core/monads/result";
import { Entity } from "../../util/Entity";
import { UniqueEntityID } from "../../util/UniqueEntityID";
import { EmailAddress } from "./EmailAddress";
import { OAuthUserProps } from "./OauthUserProps";

export class User extends Entity<OAuthUserProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get displayName(): string | null {
    return this.props.displayName;
  }

  get photoURL(): string | null {
    return this.props.photoURL;
  }

  get emailAddress(): EmailAddress {
    return this.props.emailAddress;
  }

  protected constructor(props: OAuthUserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: OAuthUserProps,
    id?: UniqueEntityID
  ): Result<User, Error> {
    const user = new User(props, id);
    return Result.ok(user);
  }
}
