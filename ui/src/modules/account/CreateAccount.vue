<template>
  <div class="create_account">
    <h1 class="text-gray-600 text-5xl block mb-3">Create an Account</h1>
    <div>
      <button class="button text-gray-800" v-on:click="handleGoogleSignIn">
        Google
      </button>
      <button class="button text-gray-800" v-on:click="handleAppleSignIn">
        Apple
      </button>
      <a
        class="button text-gray-800"
        target="_blank"
        v-bind:href="slackSignInURL"
      >
        Slack
      </a>
    </div>
    <form action="" class="form create_account__form">
      <fieldset class="fieldset">
        <div class="fields">
          <div class="input_field">
            <!-- Name -->
            <label class="input_label" for="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              class="input"
              placeholder="Name"
            />
          </div>
          <div class="input_field">
            <!-- Email Address -->
            <label class="input_label" for="email_address">Email Address</label>
            <input
              type="text"
              name="emailAddress"
              id="email_address"
              class="input"
              placeholder="Email Address"
            />
          </div>
          <div class="input_field">
            <!-- Password -->
            <label class="input_label" for="password">Password</label>
            <input
              type="text"
              name="password"
              id="password"
              class="input"
              placeholder="Password"
            />
          </div>
        </div>
        <div class="submit_field">
          <button
            class="button button--primary create-account__submit"
            type="submit"
          >
            Create Account
          </button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Container as InversifyContainer } from "inversify";
import { TYPES } from "@/shared/providers/types";
import AccountService from "@/modules/account/account.service";
import { Logger } from "@/shared/core/logger";
import { LogManager } from "@/shared/core/logger";

@Component({
  inject: {
    container: TYPES.Container,
  },
})
export default class CreateAccount extends Vue {
  container!: InversifyContainer;
  service?: AccountService;
  logger?: Logger;

  get slackSignInURL(): string {
    if (!this.service) {
      throw new Error("");
    }
    return this.service?.getSlackSignInUrl();
  }

  created(): void {
    this.service = this.container.get(TYPES.AccountService);
    this.logger = this.container
      .get<LogManager>(TYPES.LogManager)
      .getLogger("modules.account.CreateAccount");

    this.logger?.trace("created CreateAccount");
  }

  handleGoogleSignIn(): void {
    this.service?.signInWithGoogle();
  }
}
</script>

<style land="scss">
.create_account {
  @apply w-full;
  @apply mx-auto;
  @apply my-0;
}

.create_account__form {
  @apply flex;
  @apply m-0;
  @apply p-8;
  @apply justify-center;
}
.submit_field {
  @apply mx-auto;
  @apply mt-9;
}
</style>
