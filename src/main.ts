import { createApp } from "vue";
import "./main.css";
import App from "@/App.vue";
import i18n from "@/i18n";
import "@/composables/useSettings";

const app = createApp(App);
app.use(i18n);
app.mount("#app");
