import { DeepPartial } from "@/shared/core/types";
import firebase from "firebase/app";

export default jest.mock("firebase/app", () => {
  const analytics = jest.fn().mockReturnValue({
    logEvent: jest.fn(),
  });

  let _user: DeepPartial<firebase.User> | null = null;

  const auth: any = jest.fn().mockReturnValue({
    signInWithRedirect: jest.fn(),
    createUserWithEmailAndPassword: function () {
      return Promise.resolve({
        user: _user,
      });
    },
    getRedirectResult: jest.fn().mockResolvedValue({
      credential: {
        providerId: "Google",
      },
      user: {
        getIdToken: jest.fn().mockResolvedValue("abc1234"),
      },
      additionalUserInfo: {
        profile: {
          email: "test@test.com",
          name: "John Doe",
        },
      },
    }),
  });

  auth.GoogleAuthProvider = class {
    addScope = jest.fn();
  };

  const __setup = (config: {
    credential: DeepPartial<firebase.auth.UserCredential>;
  }) => {
    const { credential } = config;
    _user = credential?.user || null;
  };

  return { auth, analytics, __setup };
});
