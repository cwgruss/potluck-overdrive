<template>
  <div class="ingredients">
    <h1>Ingredients</h1>
    <search-input @selected="onSelection"></search-input>
    <button class="button" @click="popIngredient">Pop</button>
  </div>
</template>

<script lang="ts">
import SearchInput from "@/shared/components/input/SearchInput.vue";
import { Component, Vue } from "vue-property-decorator";
import { IngredientsVueXStateProxy } from "@/shared/api/infrastructure/store/ingredients";
@Component({
  components: { SearchInput },
})
export default class Ingredients extends Vue {
  private _ingredientService!: IngredientsVueXStateProxy;
  created(): void {
    this._ingredientService = new IngredientsVueXStateProxy();
  }

  onSelection(value: string): void {
    console.log(value);
    this._ingredientService.addIngredient(value);
  }

  popIngredient(): void {
    this._ingredientService.popIngredient().then((ingredient) => {
      console.log({ ingredient });
    });
  }
}
</script>

<style></style>
