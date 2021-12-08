import { Inject } from '@nestjs/common';
import { EmailAddress } from '../domain/email-address.model';
import { UserDocument } from './user.document';
import { CollectionReference } from '@google-cloud/firestore';
import { User } from '../domain/user.model';
import { UserMap } from '../mappers/user.mapper';

export interface IUserRepository {
  findUserByEmailAddress(emailAddress: EmailAddress): Promise<User>;
  exists(emailAddress: EmailAddress): Promise<boolean>;
  save(user: User): Promise<void>;
}

export class UserRepository implements IUserRepository {
  constructor(
    @Inject(UserDocument.COLLECTION)
    private _usersCollection: CollectionReference,
  ) {}

  findUserByEmailAddress(emailAddress: EmailAddress): Promise<User> {
    const docRef = this._usersCollection
      .where('emailAddress', '==', emailAddress.value)
      .get();

    const user = new Promise<User>((resolve, reject) => {
      docRef.then((snapshot) => {
        const addressExists = !snapshot.empty;
        if (!addressExists) {
          reject('No users with that email address could be found.');
        }

        if (snapshot.size > 1) {
          reject('Number of users with that email address exceeds 1.');
        }

        const rawUser = snapshot.docs[0].data();
        const user = UserMap.toDomain(rawUser);
        return resolve(user);
      });
    });

    return user;
  }

  exists(emailAddress: EmailAddress): Promise<boolean> {
    const docRef = this._usersCollection
      .where('emailAddress', '==', emailAddress.value)
      .get();

    const exists = new Promise<boolean>((resolve, reject) => {
      docRef
        .then((snapshot) => {
          const addressExists = !snapshot.empty;
          resolve(addressExists);
        })
        .catch((reason) => {
          reject(reason);
        });
    });

    return exists;
  }

  async save(user: User): Promise<void> {
    const alreadyExists = await this.exists(user.emailAddress);
    const rawUser = UserMap.toPersistance(user);

    try {
      if (!alreadyExists) {
        await this._usersCollection.add(rawUser);
      } else {
        const docRef = this._usersCollection.doc(user.id.toString());
        // Don't update everything. Instead, update the
        // properties permitted to be overwritten
        await docRef.update({
          displayName: rawUser.displayName,
          photoURL: rawUser.photoURL,
          role: rawUser.role,
        });
      }
    } catch (error) {
      console.error(error);
    }

    return;
  }
}
