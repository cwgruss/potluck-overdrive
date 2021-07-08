<template>
  <div>
    <section class="layout-container max-w-4xl mx-auto p-8">
      <div class="p-20 bg-gray-50 border-2 border-gray-400">
        <create-account class="pt-6"></create-account>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CreateAccount from "@/components/account/CreateAccount.vue"; // @ is an alias to /src

@Component({
  components: {
    CreateAccount,
  },
})
export default class Home extends Vue {}
</script>
