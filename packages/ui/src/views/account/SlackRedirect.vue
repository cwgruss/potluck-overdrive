<template>
  <div>
    <h1 class="text-lg text-gray-900">Slack | Sign-In</h1>
    <section class="layout-container max-w-4xl mx-auto p-8">
      <div class="p-20 bg-gray-50 border-2 border-gray-400 text-gray-900">
        <p>Code: {{ code }}</p>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TYPES } from "@/shared/providers/types";
import { Container as InversifyContainer } from "inversify";
import { AccountService } from "@/modules/account/account.service";

@Component({
  inject: {
    container: TYPES.Container,
  },
})
export default class Home extends Vue {
  container!: InversifyContainer;
  private _accountService?: AccountService;
  code = "";

  created(): void {
    this._accountService = this.container.get<AccountService>(
      TYPES.AccountService
    );
  }
}
</script>
