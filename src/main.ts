import "./css/main.css";

import { createApp } from "vue";
import router from "./router/router";
import store from "./stores/store";
import App from "./App.vue";
import { useMatchStore } from "./stores/matchStore";
import { useSelectionStore } from "./stores/selectionStore";

createApp(App) //
	.use(router) //
	.use(store) //
	.mount("#app");

useMatchStore().loadFromStorage();
useSelectionStore().loadFromStorage();
