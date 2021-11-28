export enum AccountActions {
  SIGN_IN_WITH_GOOGLE = "account/signInWithGoogle",
  SIGN_IN_WITH_SLACK = "account/signInWithSlack",
  SIGN_IN_WITH_EMAIL_AND_PASSWORD = "account/signInWithEmailAndPassword",
  SIGN_OUT = "account/signOut",
}

export enum AccountGetters {
  GET_CURRENT_USER = "account/getCurrentUser",
}
