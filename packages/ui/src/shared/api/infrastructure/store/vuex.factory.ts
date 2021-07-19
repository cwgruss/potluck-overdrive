import { ActionTree, GetterTree, Module, MutationTree } from "vuex";

export interface VueXStateFactoyMethod<S> {
  (...args: any[]): S | (() => S);
}

export interface VueXGettersFactoyMethod<S, R> {
  (...args: any[]): GetterTree<S, R>;
}

export interface VueXActionsFactoryMethod<S, R> {
  (...args: any[]): ActionTree<S, R>;
}

export interface VueXMutationsFactoryMethod<S> {
  (...args: any[]): MutationTree<S>;
}

export interface VueXModuleFactoryMethod<S, R> {
  (...args: any[]): Module<S, R>;
}

export interface VueXModuleFactory<S, R> {
  createInitialState: VueXStateFactoyMethod<S>;
  createGetters: VueXGettersFactoyMethod<S, R>;
  createActions: VueXActionsFactoryMethod<S, R>;
  createMutations: VueXMutationsFactoryMethod<S>;
  createModule: VueXModuleFactoryMethod<S, R>;
}
