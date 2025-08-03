import { createWebHistory, createRouter } from "vue-router";
import { ROUTES } from "@/constants";

import HomeView from "../views/HomeView.vue";
import MatchView from "../views/MatchView.vue";
import MatchupInsightView from "../views/MatchupInsightView.vue";

const routes = [
	{ path: ROUTES.HOME, component: HomeView },
	{ path: ROUTES.MATCHES, component: MatchView },
	{ path: ROUTES.INSIGHTS, component: MatchupInsightView },
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
