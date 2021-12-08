import { AggregateRoot } from '@nestjs/cqrs';
import { UniqueEntityID } from 'src/core/domain/UniqueEntityID';
import { Result } from 'src/core/monads/result';
import { EmailAddress } from './email-address.model';
import { UserCreatedEvent } from './events/userCreated.event';

interface UserProps {
  firstName: string;
  lastName: string;
  displayName: string;
  emailAddress: EmailAddress;
  role?: string;
  isEmailVerified?: boolean;
  profilePicture?: string;
  dateJoined?: Date;
  dateLastSignedOn?: Date;
}

export class User extends AggregateRoot {
  get id(): UniqueEntityID {
    return this._id;
  }
  protected _id: UniqueEntityID;

  get firstName(): string {
    return this._firstName;
  }
  protected _firstName: string;

  get lastName(): string {
    return this._lastName;
  }
  protected _lastName: string;

  get emailAddress(): EmailAddress {
    return this._emailAddress;
  }
  protected _emailAddress: EmailAddress;

  get isEmailVerified(): boolean {
    return this._isEmailVerified;
  }
  protected _isEmailVerified: boolean;

  get displayName(): string {
    return this._displayName;
  }
  protected _displayName: string;

  get profilePicture(): string {
    return this._profilePicture;
  }
  protected _profilePicture: string;

  get dateJoined(): Date {
    return this._dateJoined;
  }
  protected _dateJoined: Date;

  get dateLastSignedOn(): Date {
    return this._dateLastSignedOn;
  }
  protected _dateLastSignedOn: Date;

  get role(): string {
    return this._role;
  }
  protected _role: string;

  constructor(props: UserProps, id?: UniqueEntityID) {
    super();
    this._id = id ? id : new UniqueEntityID();
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._displayName = props.displayName;
    this._emailAddress = props.emailAddress;
    this._isEmailVerified = props.isEmailVerified;
    this._profilePicture = props.profilePicture;
    this._dateJoined = props.dateJoined;
    this._dateLastSignedOn = props.dateLastSignedOn;
    this._role = props.role;
  }

  public static create(
    props: UserProps,
    id?: UniqueEntityID,
  ): Result<User, Error> {
    const user = new User(
      {
        ...props,
      },
      id,
    );

    const wasIdProvided = !!id;

    if (!wasIdProvided) {
      user.apply(new UserCreatedEvent(user.id));
    }

    return Result.ok(user);
  }
}
