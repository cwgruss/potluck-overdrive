import {
  BindingScopeEnum,
  Container as InversifyContainer,
  interfaces,
} from "inversify";
import getDecorators from "inversify-inject-decorators";

import firebase from "firebase/app";
import FirebaseAuthRepository from "../infrastructure/repositories/Auth.repository.";
import AccountService from "../services/account/account.service";
import Newable = interfaces.Newable;
import ServiceIdentifier = interfaces.ServiceIdentifier;
import { Nullable } from "@/util/types";
import { TYPES } from "./types";
import { analytics, auth, firestore } from "@/firebase";

const INVERSIFY_CONFIG = {
  autoBindInjectable: true,
  defaultScope: BindingScopeEnum.Singleton,
};

export const typeMap: ReadonlyMap<
  ServiceIdentifier<any>,
  Newable<any>
> = new Map<ServiceIdentifier<any>, Newable<any>>([
  [TYPES.Authentication, FirebaseAuthRepository],
  [TYPES.AccountService, AccountService],
]);

let container: Nullable<InversifyContainer> = createContainer();
export let lazyInject: ReturnType<typeof getDecorators>;

function bindDependency<T>(typeId: ServiceIdentifier<T>, type?: Newable<T>) {
  container!.bind<any>(typeId).to(type || typeMap.get(typeId)!);
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

  container.bind<firebase.auth.Auth>(TYPES.FirebaseAuth).toConstantValue(auth);

  container
    .bind<firebase.firestore.Firestore>(TYPES.Firestore)
    .toConstantValue(firestore);

  container
    .bind<firebase.analytics.Analytics>(TYPES.FirebaseAnalytics)
    .toConstantValue(analytics);

  for (const typeId of containedDependencies) {
    bindDependency(typeId);
  }

  lazyInject = getDecorators(container);
  return container;
}