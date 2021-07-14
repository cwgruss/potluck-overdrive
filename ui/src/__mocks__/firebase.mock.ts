import { DeepPartial } from "@/shared/core/types";
import firebase from "firebase/app";

export default jest.mock("firebase/app", () => {
  const analytics = jest.fn().mockReturnValue({
    logEvent: jest.fn(),
  });

  let _credential: DeepPartial<firebase.auth.UserCredential> | null;
  let _profile: DeepPartial<firebase.auth.AdditionalUserInfo | null>;
  const auth: any = jest.fn().mockReturnValue({
    signInWithRedirect: jest.fn(),
    createUserWithEmailAndPassword: function () {
      return Promise.resolve({ ..._credential });
    },
    signInWithEmailAndPassword: function () {
      return Promise.resolve({ ..._credential });
    },
    signInWithPopup: function () {
      return Promise.resolve({ ..._credential });
    },
    getRedirectResult: function () {
      return Promise.resolve({
        credential: { ..._credential },
        user: {
          getIdToken: jest.fn().mockResolvedValue("abc1234"),
        },
        additionalUserInfo: {
          profile: {
            email: "test@test.com",
            name: "John Doe",
          },
        },
      });
    },
  });

  auth.GoogleAuthProvider = class {
    addScope = jest.fn();
  };

  const __setup = (config: {
    credential: DeepPartial<firebase.auth.UserCredential>;
    profile: DeepPartial<firebase.auth.AdditionalUserInfo>;
  }) => {
    const { credential, profile } = config;
    _credential = credential;
    _profile = profile;
  };

  return { auth, analytics, __setup };
});
