import { getContainer } from "@/shared/providers";
import { injectable } from "inversify";
import { RootState } from "../root";
import {
  VueXActionsFactoryMethod,
  VueXGettersFactoyMethod,
  VueXModuleFactory,
  VueXModuleFactoryMethod,
  VueXMutationsFactoryMethod,
  VueXStateFactoyMethod,
} from "../vuex.factory";
import { IngredientsCache } from "./ingredients.cache";

export interface IngredientsState {
  ingredients: string[];
}

const ADD_INGREDIENT = "ADD_INGREDIENT";
const POP_LAST_INGREDIENT = "POP_LAST_INGREDIENT";

@injectable()
class VueXIngredientsModule
  implements VueXModuleFactory<IngredientsState, RootState>
{
  constructor(private _cache: IngredientsCache) {}

  createInitialState: VueXStateFactoyMethod<IngredientsState> = () => {
    const initialState: IngredientsState = {
      ingredients: this._cache.getIngredients(),
    };
    return initialState;
  };

  createGetters: VueXGettersFactoyMethod<IngredientsState, RootState> = (
    state: IngredientsState
  ) => {
    return {
      ingredients(): string[] {
        return state.ingredients;
      },
    };
  };

  createActions: VueXActionsFactoryMethod<IngredientsState, RootState> = (
    state: IngredientsState
  ) => {
    return {
      addIngredient(
        { commit },
        payload: { ingredient: string }
      ): Promise<void> {
        return new Promise((resolve, reject) => {
          commit(ADD_INGREDIENT, payload);
        });
      },

      popLastIngredient({ commit }): Promise<string> {
        return new Promise((resolve, reject) => {
          const lastEl = state.ingredients.slice(-1)[0];
          commit(POP_LAST_INGREDIENT);
          resolve(lastEl);
        });
      },
    };
  };

  createMutations: VueXMutationsFactoryMethod<IngredientsState> = (
    state: IngredientsState
  ) => {
    return {
      [ADD_INGREDIENT]: (
        state: IngredientsState,
        payload: { ingredient: string }
      ) => {
        const { ingredient } = payload;
        state.ingredients.push(ingredient);
        this._cache.setIngredients(state.ingredients);
      },
      [POP_LAST_INGREDIENT]: (state: IngredientsState) => {
        state.ingredients.pop();
        this._cache.setIngredients(state.ingredients);
      },
    };
  };

  createModule: VueXModuleFactoryMethod<IngredientsState, RootState> = () => {
    const state = this.createInitialState();
    const getters = this.createGetters(state);
    const actions = this.createActions(state);
    const mutations = this.createMutations(state);

    return {
      namespaced: true,
      state,
      getters,
      actions,
      mutations,
    };
  };
}

export const ingredientsVueXModule = getContainer().resolve(
  VueXIngredientsModule
);
