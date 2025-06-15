import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "../views/HomeView.vue";
import MatchView from "../views/MatchView.vue";
import MatchupInsightView from "../views/MatchupInsightView.vue";

const routes = [
	{ path: "/", component: HomeView },
	{ path: "/matches", component: MatchView },
	{ path: "/insights", component: MatchupInsightView },
];

const router = createRouter({
	history: createMemoryHistory(),
	routes,
});

export default router;
