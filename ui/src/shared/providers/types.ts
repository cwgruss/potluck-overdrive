const TYPES = {
  Container: Symbol.for("Container"),
  FirebaseAuth: Symbol.for("Vendor/Services/Authentication"),
  FirebaseAnalytics: Symbol.for("Vendor/Services/Analytics"),
  Firestore: Symbol.for("Vendors/Services/Firestore"),
  Authentication: Symbol.for("Domain/Repositories/Authentication"),
  AccountService: Symbol.for("Services/Account"),
  LogManager: Symbol.for("Shared/Util/Logger/LogManager"),
};

export { TYPES };
