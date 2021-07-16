import "reflect-metadata";
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./shared/api/infrastructure/store";
import "./scss/main.scss";
import { auth } from "./firebase";

Vue.config.productionTip = false;

console.log("Create new Vue App");
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
