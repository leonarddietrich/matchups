<template>
	<div class="navbar">
		<div class="navbar-brand">
			<img src="@/assets/logo.svg" alt="Logo" class="logo" />
		</div>
		<nav>
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/matches">Matches</RouterLink>
			<RouterLink to="/insights">Insight</RouterLink>
		</nav>
	</div>

	<main>
		<RouterView />
	</main>
</template>

<script lang="ts" setup></script>

<style scoped lang="css">
main {
	display: flex;
	place-items: center;
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
