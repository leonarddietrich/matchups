<template>
	<div class="navbar">
		<div class="navbar-brand">
			<img src="@/assets/site/sports-fight-svgrepo-com.svg" alt="Logo" class="logo" />
		</div>
		<MatchCollectionSelector />
		<nav>
			<RouterLink :to="ROUTES.HOME">Home</RouterLink>
			<RouterLink :to="ROUTES.MATCHES">Matches</RouterLink>
			<RouterLink :to="ROUTES.INSIGHTS">Insight</RouterLink>
		</nav>
	</div>

	<main>
		<RouterView />
	</main>
</template>

<script lang="ts" setup>
import MatchCollectionSelector from './components/MatchCollectionSelector.vue'
import { ROUTES } from "@/constants";
</script>

<style scoped lang="css">
main {
	display: block;
	margin: 20px;
}

img {
	width: 40px;
	height: 40px;
}

#RouterLink {
	margin: 0 10px;
	text-decoration: none;
	color: #333;
}
</style>
