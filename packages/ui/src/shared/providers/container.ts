import {
  BindingScopeEnum,
  Container as InversifyContainer,
  interfaces,
} from "inversify";
import getDecorators from "inversify-inject-decorators";

import firebase from "firebase/app";

import { AccountService } from "@/modules/account/account.service";
import Newable = interfaces.Newable;
import ServiceIdentifier = interfaces.ServiceIdentifier;
import { Nullable } from "@/shared/core/types";
import { TYPES } from "./types";
import { analytics, auth, firestore } from "@/firebase";
import { logging, LogManager } from "../core/logger";
import {
  FirebaseAuthAdapter,
  SlackAuthAdapter,
} from "@/shared/api/infrastructure/adapters";
import { AccountCache } from "../api/infrastructure/store/account/account.cache";
import { AccountVueXStateProxy } from "../api/infrastructure/store/account/account.proxy";
import { IngredientsCache } from "../api/infrastructure/store/ingredients/ingredients.cache";
const INVERSIFY_CONFIG = {
  autoBindInjectable: true,
  defaultScope: BindingScopeEnum.Singleton,
};

export const typeMap: ReadonlyMap<
  ServiceIdentifier<any>,
  Newable<any>
> = new Map<ServiceIdentifier<any>, Newable<any>>([
  [TYPES.AccountCache, AccountCache],
  [TYPES.IngredientsCache, IngredientsCache],
  [TYPES.FirebaseAuth, FirebaseAuthAdapter],
  [TYPES.SlackAuth, SlackAuthAdapter],
  [TYPES.AccountService, AccountService],
]);

let container: Nullable<InversifyContainer> = createContainer();
export let lazyInject: ReturnType<typeof getDecorators>;

function bindDependency<T>(typeId: ServiceIdentifier<T>, type?: Newable<T>) {
  container!
    .bind<any>(typeId)
    .to(type || typeMap.get(typeId)!)
    .inSingletonScope();
}

export function getContainer() {
  if (!container) {
    throw new TypeError("Container is not instantiated");
  }
  return container;
}

export function isContainerCreated() {
  return !!container;
}

export function createContainer(
  ensuredDependencies:
    | Nullable<ServiceIdentifier<any>[]>
    | "all"
    | "autoBindAll" = null,
  forceNew = false
) {
  if (container && !forceNew) {
    throw new TypeError(
      "Container is already instantiated. Call with `forceNew === true` to override"
    );
  }

  const containedDependencies = Array.from(typeMap.keys());

  container = new InversifyContainer(INVERSIFY_CONFIG);

  container
    .bind<firebase.auth.Auth>(TYPES.__FirebaseAuth__)
    .toConstantValue(auth);

  container
    .bind<firebase.firestore.Firestore>(TYPES.__Firestore__)
    .toConstantValue(firestore);

  container
    .bind<firebase.analytics.Analytics>(TYPES.__FirebaseAnalytics__)
    .toConstantValue(analytics);

  container.bind<LogManager>(TYPES.LogManager).toConstantValue(logging);
  for (const typeId of containedDependencies) {
    bindDependency(typeId);
  }

  lazyInject = getDecorators(container);
  return container;
}
