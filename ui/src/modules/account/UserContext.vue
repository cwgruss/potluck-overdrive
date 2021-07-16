<template>
  <div class="user-context" :is-signed-in="isSignedIn">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TYPES } from "../../shared/providers/types";

@Component({
  inject: {
    container: TYPES.Container,
  },
  computed: {
    isSignedIn() {
      console.log(this.$store);

      return this.$store.state.account.isSignedIn ? "true" : "false";
    },
  },
})
export default class UserContext extends Vue {
  created(): void {
    console.log("user-context");
  }
}
</script>

<style></style>
