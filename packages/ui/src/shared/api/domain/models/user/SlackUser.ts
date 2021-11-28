import { Entity } from "../../util/Entity";
import { UniqueEntityID } from "../../util/UniqueEntityID";
import { EmailAddress } from "./EmailAddress";
import { OAuthUserProps } from "./OauthUserProps";

export default class SlackAuthUser extends Entity<OAuthUserProps> {
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

  private constructor(props: OAuthUserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: OAuthUserProps,
    id?: UniqueEntityID
  ): SlackAuthUser {
    return new SlackAuthUser(props, id);
  }
}
