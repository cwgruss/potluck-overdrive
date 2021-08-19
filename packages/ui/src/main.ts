import "reflect-metadata";
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./shared/api/infrastructure/store/store";
import "./scss/main.scss";
import { intializeSentry } from "@/shared/core/logger/sentry.config";

Vue.config.productionTip = false;

// During pre-rendering the initial state is
// injected into the global scope, here we
// fill the store with the initial state.
if (window.__INITIAL_STATE__) store.replaceState(window.__INITIAL_STATE__);

intializeSentry().then(() => {
  new Vue({
    router,
    store,
    render: (h) => h(App),
    mounted() {
      document.dispatchEvent(new Event("render-event"));
    },
  }).$mount("#app");
});
