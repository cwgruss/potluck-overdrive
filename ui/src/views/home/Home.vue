<template>
  <div>
    <h2>Is Signed In {{ $store.state.account.isSignedIn }}</h2>
    <user-context>
      <section class="layout-container max-w-4xl mx-auto p-8">
        <div class="p-20 bg-gray-50 border-2 border-gray-400">
          <create-account class="pt-6"></create-account>
          <sign-in class="pt-6"></sign-in>
        </div>
      </section>
    </user-context>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CreateAccount from "@/modules/account/CreateAccount.vue";
import SignIn from "@/modules/account/SignIn.vue";
import UserContext from "@/modules/account/UserContext.vue";
import { TYPES } from "@/shared/providers/types";
import { Container as InversifyContainer } from "inversify";

@Component({
  inject: {
    container: TYPES.Container,
  },
  components: {
    CreateAccount,
    SignIn,
    UserContext,
  },
})
export default class Home extends Vue {
  container?: InversifyContainer;
}
</script>
