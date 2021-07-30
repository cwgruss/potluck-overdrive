<template>
  <div
    class="search__input-wrapper"
    role="combobox"
    aria-expanded="${this.expanded}"
    aria-controls="web-search__input"
    aria-owns="${this.resultsEl.id}-list"
    aria-haspopup="listbox"
  >
    <div class="input_field">
      <label class="input_label" for="search__input">Search</label>
      <input
        id="search__input"
        ref="search__input"
        class="input search__input"
        type="text"
        role="searchbox"
        autocomplete="off"
        aria-autocomplete="list"
        placeholder="Search"
        @keydown="onKeydown"
        @input="onInput"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";

@Component({})
export default class SearchInput extends Vue {
  @Ref("search__input")
  private readonly _searchEl!: HTMLInputElement;
  private _selectedValue = "";

  onKeydown(event: KeyboardEvent): void {
    const navigationKeys = [
      "Home",
      "End",
      "Up",
      "ArrowUp",
      "Down",
      "ArrowDown",
    ];
    // Check if the user is navigating within the search popout.
    if (navigationKeys.includes(event.key)) {
      event.preventDefault();
      //   /** @type {WebSearchResults} */ this.resultsEl.navigate(event.key);
    }
    if (["Esc", "Escape"].includes(event.key)) {
      //   /** @type HTMLElement */ document.activeElement.blur();
      return;
    }

    if (["Enter"].includes(event.key)) {
      this.selectOption(this._selectedValue);
    }
  }

  onInput(event: Event): void {
    const el = this._searchEl;
    const value = el.value;
    console.log({ value });

    this.search(value);
  }

  selectOption(option: string): void {
    this._selectedValue = option;
    this.$emit("selected", this._selectedValue);
    this.clear();
  }

  async search(value: string): Promise<void> {
    // console.log(value);
    this._selectedValue = value;
  }

  clear(): void {
    this._searchEl.value = "";
    this._selectedValue = "";
  }
}
</script>

<style></style>
