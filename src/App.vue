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
.navbar {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20px;
	background-color: rgb(36, 21, 59);
	z-index: 1000;
}

main {
	display: block;
	padding-top: 60px; /* adjusted for fixed navbar */
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
