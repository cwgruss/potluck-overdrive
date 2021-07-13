import { inject, injectable } from "inversify";
import firebase from "firebase";
import { TYPES } from "@/shared/providers/types";
@injectable()
export default class FirebaseAccountRepositoty {
  private _usersRef: firebase.firestore.DocumentData;
  constructor(
    @inject(TYPES.__Firestore__)
    private _firestore: firebase.firestore.Firestore
  ) {
    this._usersRef = _firestore.collection("users");
  }

  async getUserByUID(uid: string): Promise<any> {
    const user = this._usersRef.get(uid);
  }
}
