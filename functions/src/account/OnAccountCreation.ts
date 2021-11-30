import * as functions from "firebase-functions";
import { db } from "../../config";

export const OnUserCreation = functions.auth
  .user()
  .onCreate(async (user): Promise<void> => {
    if (!user.email) {
      return;
    }

    const ref = db.collection("users").doc(user.uid);
    const { uid, displayName, photoURL, email } = user;
    await ref.set(
      {
        uid,
        displayName,
        photoURL,
        email,
        joined: Date.now(),
        role: "contributor",
      },
      { merge: true }
    );
  });
