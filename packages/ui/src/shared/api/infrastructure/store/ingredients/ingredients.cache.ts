import { Ingredient } from "@/shared/api/domain/models/ingredient/Ingredient";
import { AbstractStorage } from "@/shared/core/storage/storage";
import { injectable } from "inversify";

enum AccountCacheKeys {
  INGREDIENTS = "INGREDIENTS",
}

@injectable()
export class IngredientsCache extends AbstractStorage<AccountCacheKeys> {
  constructor() {
    super();
  }

  public getIngredients(): Ingredient[] {
    const val = this.getItem(AccountCacheKeys.INGREDIENTS);
    const arr = val ? JSON.parse(val) : [];
    return arr;
  }

  public setIngredients(ingredients: Ingredient[]) {
    const strIngredients = JSON.stringify(ingredients);
    this.setItem(AccountCacheKeys.INGREDIENTS, strIngredients);
  }

  public clearAll() {
    this.clearItems([AccountCacheKeys.INGREDIENTS]);
  }
}
