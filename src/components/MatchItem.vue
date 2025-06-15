<template>
	<div class="match">
		<div>
			<div class="match-header" style="">
				<div>
					<div>Player Name</div>
					<div>{{ match.player_elo }}</div>
				</div>
				<div>
					<div>{{ match.opponent_name }}</div>
					<div>{{ match.opponent_elo }}</div>
				</div>
			</div>
		</div>
		<div class="match-body">
			<MatchRoundItem
				v-for="round_index in match.results.length"
				:key="match.match_id + '_' + round_index"
				v-bind:stage="match.stages[round_index - 1]"
				:player="match.player_characters[round_index - 1]"
				:opponent="match.opponent_characters[round_index - 1]"
				:result="match.results[round_index - 1]"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import MatchRoundItem from "./MatchRoundItem.vue";

defineProps({
	match: {
		type: Object,
		required: true,
	},
});
</script>

<style scoped lang="css">
.match {
	width: 400px;
	box-sizing: border-box;
	justify-content: space-evenly;
}
.match-header {
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.5);
	text-align: center;
	max-width: 400px;
}
</style>
