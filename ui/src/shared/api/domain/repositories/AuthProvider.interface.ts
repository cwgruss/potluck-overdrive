import firebase from "firebase/app";
import "firebase/auth";

export const enum FirebaseAuthProviderTypes {
  Google = "Google",
}

export const enum OAuthProviderTypes {
  Slack = "Slack",
}

type AuthProviderMap = {
  [key in FirebaseAuthProviderTypes]?: firebase.auth.AuthProvider;
};

export const AuthProvider: AuthProviderMap = {
  Google: new firebase.auth.GoogleAuthProvider(),
};

export const OAuthProviderUrls: { [key in OAuthProviderTypes]: string } = {
  Slack: `https://slack.com/oauth/v2/authorize?client_id=${process.env.VUE_APP_SLACK_CLIENT_ID}&user_scope=identity.basic`,
};
