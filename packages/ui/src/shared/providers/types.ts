const TYPES = {
  Container: Symbol.for("Container"),
  __FirebaseAuth__: Symbol.for("Vendor/Services/Authentication"),
  __FirebaseAnalytics__: Symbol.for("Vendor/Services/Analytics"),
  __Firestore__: Symbol.for("Vendors/Services/Firestore"),
  AccountCache: Symbol.for("store/storage/account/cache"),
  IngredientsCache: Symbol.for("store/storage/ingredients/cache"),
  FirebaseAuth: Symbol.for("Domain/Authentication/Firebase"),
  SlackAuth: Symbol.for("Domain/Authentication/Slack"),
  AccountService: Symbol.for("Services/Account"),
  LogManager: Symbol.for("Shared/Util/Logger/LogManager"),
};

export { TYPES };
