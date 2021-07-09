import firebase from "firebase/app";

export default class FirebaseAuthUser {
  private _uid: string | null = null;
  private _photoURL: string | null = null;

  get uid(): string | null {
    return this._uid;
  }

  get photoURL(): string | null {
    return this._photoURL;
  }

  constructor(
    private _name: string | null,
    private _emailAddress: string | null,
    private _credential?: firebase.auth.UserCredential
  ) {
    this._initFromCredential(_credential);
  }

  private _initFromCredential(credential?: firebase.auth.UserCredential): void {
    if (!credential || !credential.user) {
      return;
    }
    const { user } = credential;

    this._photoURL = user.photoURL;
    this._uid = user.uid;
  }
}
