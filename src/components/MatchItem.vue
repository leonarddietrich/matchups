<template>
	<div class="match">
		<div>
			<div class="match-header" style="">
				<div>
					<div>You</div>
					<div>{{ props.match.playerElo }}</div>
				</div>
				<div>
					<div>{{ props.match.opponentName }}</div>
					<div>{{ props.match.opponentElo }}</div>
				</div>
			</div>
		</div>
		<div class="match-body">
			<MatchRoundItem
				v-for="round_index in props.match.rounds.length"
				:key="props.match.id + '_' + round_index"
				v-bind:stage="props.match.rounds[round_index - 1].stage"
				:player="props.match.rounds[round_index - 1].playerRival"
				:opponent="props.match.rounds[round_index - 1].opponentRival"
				:result="props.match.rounds[round_index - 1].won"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import MatchRoundItem from './MatchRoundItem.vue'
import type { Match } from '@/types/roa2Types'

const props = defineProps<{ match: Match }>()
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
