import { Inject } from '@nestjs/common';
import { UserDocument } from '../../shared/infrastructure/firestore/documents/user.document';
import { EmailAddress } from '../domain/email-address.model';
import { User } from '../domain/user.model';
import { UserMap } from '../mappers/user.mapper';
import {
  DocumentData,
  query,
  where,
  getDocs,
  CollectionReference,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

export abstract class IUserRepository {
  abstract findUserByEmailAddress(emailAddress: EmailAddress): Promise<User>;
  abstract exists(emailAddress: EmailAddress): Promise<boolean>;
  abstract save(user: User): Promise<void>;
}

export class UserRepository extends IUserRepository {
  constructor(
    @Inject(UserDocument.COLLECTION)
    private _usersCollection: CollectionReference<DocumentData>,
  ) {
    super();
  }

  findUserByEmailAddress(emailAddress: EmailAddress): Promise<User> {
    const q = query(
      this._usersCollection,
      where('emailAddress', '==', emailAddress.value),
    );
    const querySnapshot = getDocs(q);

    const user = new Promise<User>((resolve, reject) => {
      querySnapshot.then((snapshot) => {
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

  async exists(emailAddress: EmailAddress): Promise<boolean> {
    const q = query(
      this._usersCollection,
      where('emailAddress', '==', emailAddress.value),
    );
    const querySnapshot = getDocs(q);

    const exists = new Promise<boolean>((resolve, reject) => {
      querySnapshot
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
        const newUserDoc = doc(this._usersCollection);
        setDoc(newUserDoc, rawUser);
      } else {
        const docRef = doc(this._usersCollection, user.uuid.toString());

        // Don't update everything. Instead, update the
        // properties permitted to be overwritten
        await updateDoc(docRef, {
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
