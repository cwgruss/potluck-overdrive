import "reflect-metadata";
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./api/infrastructure/store";
import "./scss/main.scss";
import { auth } from "./firebase";

Vue.config.productionTip = false;

let app: Vue;
auth.onAuthStateChanged(() => {
  if (!app) {
    console.log("Create new Vue App");
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
