import firebase from "firebase/app";
import { Entity } from "../util/Entity";
import { UniqueEntityID } from "../util/UniqueEntityID";
import { EmailAddress } from "./EmailAddress";

interface FirebaseUserProps {
  uid: string;
  emailAddress: EmailAddress;
  displayName: string | null;
  photoURL: string | null;
}

export default class FirebaseAuthUser extends Entity<FirebaseUserProps> {
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

  private constructor(props: FirebaseUserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: FirebaseUserProps,
    id?: UniqueEntityID
  ): FirebaseAuthUser {
    return new FirebaseAuthUser(props, id);
  }
}
