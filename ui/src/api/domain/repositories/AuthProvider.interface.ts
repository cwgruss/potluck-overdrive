import firebase from "firebase/app";
import "firebase/auth";

export const enum AuthProviderTypes {
  Google = "Google",
  Apple = "Apple",
  Slack = "Slack",
}

type AuthProviderMap = {
  [key in AuthProviderTypes]?: firebase.auth.AuthProvider;
};

export const AuthProvider: AuthProviderMap = {
  Google: new firebase.auth.GoogleAuthProvider(),
  Apple: new firebase.auth.OAuthProvider("apple.com"),
  Slack: new firebase.auth.OAuthProvider("slack.com"),
};
