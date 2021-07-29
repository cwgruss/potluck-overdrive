import "reflect-metadata";
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./shared/api/infrastructure/store/store";
import "./scss/main.scss";
import { intializeSentry } from "@/shared/core/logger/sentry.config";

Vue.config.productionTip = false;

intializeSentry().then(() => {
  console.log(Vue);

  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
});
