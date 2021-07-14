import "reflect-metadata";
import { FirebaseAuthAdapter } from "./FirebaseAuth.adapter";
import firebase from "firebase/app";
import { DeepPartial } from "@/shared/core/types";
import { FirebaseAuthProviderTypes } from "../../domain/repositories/AuthProvider.interface";

// Explicitly mock "firebase/app"
jest.mock("firebase/app");

const firebaseAuthFactory = (
  _auth: DeepPartial<firebase.auth.Auth> = {}
): FirebaseAuthAdapter => {
  const defaultAuth = {};
  return new FirebaseAuthAdapter(_auth as firebase.auth.Auth);
};

const setupUseCase = (
  useCase: DeepPartial<{
    credential: firebase.auth.UserCredential;
  }> = {}
) => {
  (firebase as any).__setup(useCase);
  const firebaseAuthAdapter = firebaseAuthFactory(firebase.auth());
  return {
    adapter: firebaseAuthAdapter,
  };
};

describe("FirebaseAuthAdapter", () => {
  describe("registerUserWithEmailAndPassword", () => {
    let service: FirebaseAuthAdapter;

    beforeEach(() => {
      // Create a service using a mocked auth() instance
      service = setupUseCase({
        credential: {
          user: {
            displayName: "Test User",
          },
        },
      }).adapter;
    });

    it("should return a user credential", async () => {
      /* ///// 1. Arrange /////// */
      const testUser = {
        username: "testuser@test.com",
        password: "password123",
      };

      /* ///// 2. Act /////// */
      const firebaseUser = await service.registerUserWithEmailAndPassword(
        testUser.username,
        testUser.password
      );

      /* ///// 3. Assert /////// */
      expect(firebaseUser).toBeDefined();
    });

    it("should return a user credential with a 'displayName'", async () => {
      /* ///// 1. Arrange /////// */
      const testUser = {
        username: "testuser@test.com",
        password: "password123",
      };

      /* ///// 2. Act /////// */
      const firebaseUser = await service.registerUserWithEmailAndPassword(
        testUser.username,
        testUser.password
      );

      /* ///// 3. Assert /////// */
      expect(firebaseUser.displayName).toBe("Test User");
    });
  });

  describe("signInWithEmailAndPassword", () => {
    let service: FirebaseAuthAdapter;

    beforeEach(() => {
      // Create a service using a mocked auth() instance
      service = setupUseCase({
        credential: {
          user: {
            displayName: "Test User",
          },
        },
      }).adapter;
    });

    it("should return a user credential", async () => {
      /* ///// 1. Arrange /////// */
      const testUser = {
        username: "testuser@test.com",
        password: "password123",
      };

      /* ///// 2. Act /////// */
      const firebaseUser = await service.signInWithEmailAndPassword(
        testUser.username,
        testUser.password
      );

      /* ///// 3. Assert /////// */
      expect(firebaseUser).toBeDefined();
    });
  });

  describe("signInWithPopUp", () => {
    let service: FirebaseAuthAdapter;

    beforeEach(() => {
      // Create a service using a mocked auth() instance
      service = setupUseCase({
        credential: {
          user: {
            displayName: "Test User",
          },
        },
      }).adapter;
    });

    it("should return a user credential", async () => {
      /* ///// 1. Arrange /////// */
      const testUser = {
        username: "testuser@test.com",
        password: "password123",
      };

      /* ///// 2. Act /////// */
      const firebaseUser = await service.signInWithPopUp(
        FirebaseAuthProviderTypes.Google
      );

      /* ///// 3. Assert /////// */
      expect(firebaseUser).toBeDefined();
    });
  });
});
