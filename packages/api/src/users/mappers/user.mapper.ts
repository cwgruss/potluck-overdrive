import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { EmailAddress } from '../domain/email-address.model';
import { User } from '../domain/user.model';
import { UserFirestoreEntity } from '../entity/user.interface';

export class UserMap {
  static toPersistance(user: User): UserFirestoreEntity {
    return {
      uid: user.id.toString(),
      displayName: user.displayName || '',
      email: user.emailAddress.value,
      isEmailVerified: user.isEmailVerified || false,
      dateJoined: user.dateJoined,
      photoURL: user.profilePicture || '',
      role: user.role || 'contributer',
    };
  }

  static toDomain(data: unknown & Partial<UserFirestoreEntity>): User {
    const emailAddressOrError = EmailAddress.create(data.email);

    const userOrError = User.create(
      {
        displayName: data.displayName,
        emailAddress: emailAddressOrError.unwrap(),
        profilePicture: data.photoURL,
        isEmailVerified: data.isEmailVerified,
        dateJoined: new Date(data.dateJoined),
        firstName: data.firstName,
        lastName: data.lastName,
      },
      new UniqueEntityID(data.uid),
    );

    if (userOrError.isFail()) {
      console.error(userOrError.unwrapFail());
      return null;
    }

    return userOrError.unwrap();
  }
}
