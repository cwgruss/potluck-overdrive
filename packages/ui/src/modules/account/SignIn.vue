<template>
  <section class="sign_in">
    <h1 class="text-gray-600 text-5xl block mb-3">Let's sign you in.</h1>
    <p>It's been a minute.</p>
    <div>
      <button class="button text-gray-800" v-on:click="handleGoogleSignIn">
        Google
      </button>

      <!-- <a
        class="button text-gray-800"
        target="_blank"
        v-bind:href="slackSignInURL"
      >
        Slack
      </a> -->

      <button class="button text-gray-800" v-on:click="signOut">
        Sign Out
      </button>
    </div>
    <form action="" class="form create_account__form">
      <fieldset class="fieldset">
        <div class="fields">
          <div class="input_field">
            <!-- User uid (usernmae, email, or phone number) -->
            <label class="input_label" for="user_uid"
              >Phone, Email, or Username</label
            >
            <input
              type="text"
              name="user_uid"
              id="user_uid"
              class="input"
              placeholder="Phone, Email, or Username"
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
            Sign In
          </button>
        </div>
      </fieldset>
    </form>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Container as InversifyContainer } from "inversify";
import { TYPES } from "@/shared/providers/types";
import { AccountService } from "@/modules/account/account.service";
import { AccountVueXStateProxy } from "@/shared/api/infrastructure/store/account";

@Component({
  inject: {
    container: TYPES.Container,
  },
})
export default class SignIn extends Vue {
  container!: InversifyContainer;
  private _accountService?: AccountService;
  _stateProxy: AccountVueXStateProxy;

  created() {
    this._stateProxy = new AccountVueXStateProxy();
    console.log(this._stateProxy);
  }

  handleGoogleSignIn(): void {
    this._stateProxy.signInWithGoogle();
  }

  handleSlackSignIn(code: string): void {
    this._stateProxy.signInWithSlack(code);
  }

  signOut(): void {
    this._stateProxy.signOut();
  }
}
</script>

<style land="scss">
.sign_in {
  @apply w-full;
  @apply mx-auto;
  @apply my-0;
}

.sign_in__form {
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
