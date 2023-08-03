import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "../helpers/i18n";
import vuetify from "./plugins/vuetify";
import VueAxios from "vue-axios";
import VuetifyUpload from "@kingscode/vuetify-upload";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/en";

Vue.use(VuetifyUpload);
Vue.config.productionTip = false;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");
dayjs.locale("en");

router.beforeEach((to, from, next) => {
  next();
});

axios.defaults.baseURL = process.env.VUE_APP_API_BASEURL;
axios.defaults.headers.common["Authorization"] =
  "Bearer " + store.getters.getTokenId;

Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
