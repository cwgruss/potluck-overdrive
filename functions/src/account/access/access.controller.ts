import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { auth, firestore } from "firebase-admin";
import { BaseController } from "../../shared/infra/http/base.controller";

export class UpdateAccountAccessController extends BaseController {
  private _auth: auth.Auth = auth();

  constructor(private _db: firestore.Firestore) {
    super();
  }

  protected async executeImpl(
    req: Request<ParamsDictionary>,
    res: Response<any>
  ): Promise<void | any> {
    try {
      const { uid } = req.params;
      const { role } = req.body;
      const user = await this._auth.getUser(uid);
      let userDoc = await this._getUserDocByUID(uid);

      await this._auth.setCustomUserClaims(user.uid, {
        role,
      }); // 3

      await userDoc?.ref.update({
        role,
      });

      userDoc = await this._getUserDocByUID(uid);
      const data = userDoc?.data();

      return this.ok(res, {
        email: user.email,
        role: data?.role,
      });
    } catch (error) {
      return this.fail(res, error);
    }
  }

  private async _getUserDocByUID(uid: string) {
    try {
      const userDoc = await this._db
        .collection("users")
        .where("uid", "==", uid)
        .limit(1)
        .get();

      return userDoc.docs[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export class GetAccountAccessController extends BaseController {
  private _auth: auth.Auth = auth();

  constructor(private _db: firestore.Firestore) {
    super();
  }

  protected async executeImpl(
    req: Request<ParamsDictionary>,
    res: Response<any>
  ): Promise<any> {
    try {
      const { uid } = req.params;
      const user = await this._auth.getUser(uid);
      console.log("Getting user doc");

      const userDoc = await this._getUserDocByUID(uid);
      const userData = userDoc?.data();
      console.log(`user doc for ${userData?.displayName} found.`);

      if (user.customClaims && user.customClaims.role) {
        console.log(`user ${userData?.email} already had a role.`);
        return this.ok(res, {
          email: userData?.email,
          role: userData?.role,
        });
      }

      console.log(`returning 404`);

      return this.notFound(res, `No role found for user with uid ${uid}`);
    } catch (err) {
      return this.fail(res, err);
    }
  }
  private async _getUserDocByUID(uid: string) {
    try {
      const userDoc = await this._db
        .collection("users")
        .where("uid", "==", uid)
        .limit(1)
        .get();

      const data = userDoc.docs[0];
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
