import { auth, firestore } from "firebase-admin";

const admin = require("firebase-admin");
let db: typeof admin.firestore;

function initializeApp(): Promise<{
  admin: any;
  db: firestore.Firestore;
}> {
  return new Promise((resolve, reject) => {
    admin.initializeApp();
    db = firestore();
    resolve({
      admin,
      db,
    });
  });
}

export { admin, auth, firestore, initializeApp };
