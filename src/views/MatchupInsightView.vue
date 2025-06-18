<template>
	<div>
		<h1>Matchup Insight</h1>

		<div class="selectors">
			<CharacterSelection
				v-bind:allowed-rivals="playerRivals"
				v-on:character-selected="updatePlayerRival"
			/>
			<div class="divider"></div>
			<CharacterSelection
				v-bind:allowed-rivals="opponentRivals"
				v-on:character-selected="updateOpponentRival"
			/>
		</div>
		<div class="results">
			<StageInsight :player="playerRival" :opponent="opponentRival"></StageInsight>
		</div>
	</div>
</template>

<script setup lang="ts">
import CharacterSelection from '@/components/CharacterSelection.vue'
import StageInsight from '@/components/StageInsight.vue'
import { computed } from 'vue'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'
import type { RivalName, Round } from '@/scripts/roa2'

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

const playerRivals = computed<RivalName[]>(() => {
	const selectedId = selectionStore.getselectedMatchCollectionId
	if (selectedId === null) {
		return [] as RivalName[]
	} else {
		const selectedMatchCollection = matchStore.getMatchCollectionById(selectedId)
		if (!selectedMatchCollection) {
			return [] as RivalName[]
		} else {
			// Assuming selectedMatchCollection.matches is an array of matches
			const matches = (selectedMatchCollection.matches ?? []) as Array<{
				rounds: Round[]
			}>
			const allPlayerRivals = matches.flatMap((match: { rounds: Round[] }) =>
				match.rounds.map((round) => round.playerRival),
			)
			// Remove duplicates
			return Array.from(new Set(allPlayerRivals))
		}
	}
})

const opponentRivals = computed<RivalName[]>(() => {
	const selectedId = selectionStore.getselectedMatchCollectionId
	if (selectedId === null) {
		return [] as RivalName[]
	} else {
		const selectedMatchCollection = matchStore.getMatchCollectionById(selectedId)
		if (!selectedMatchCollection) {
			return [] as RivalName[]
		} else {
			// Assuming selectedMatchCollection.matches is an array of matches
			const matches = (selectedMatchCollection.matches ?? []) as Array<{
				rounds: Round[]
			}>
			const allOpponentRivals = matches.flatMap((match: { rounds: Round[] }) =>
				match.rounds.map((round) => round.opponentRival),
			)
			// Remove duplicates
			return Array.from(new Set(allOpponentRivals))
		}
	}
})

const playerRival = computed<RivalName | null>({
	get: () => useSelectionStore().getPlayerCharacter,
	set: (newSelectedRival: RivalName | null) => selectionStore.setPlayerCharacter(newSelectedRival),
})

const opponentRival = computed<RivalName | null>({
	get: () => useSelectionStore().getOpponentCharacter,
	set: (newSelectedRival: RivalName | null) =>
		selectionStore.setOpponentCharacter(newSelectedRival),
})

function updatePlayerRival(newSelectedRival: RivalName | null) {
	playerRival.value = newSelectedRival
}
function updateOpponentRival(newSelectedRival: RivalName | null) {
	opponentRival.value = newSelectedRival
}
</script>

<style scoped>
.selectors {
	display: grid;
	grid-template-columns: 1fr 2px 1fr;
	width: 100%;
	height: 100%;
}

.divider {
	width: 2px;
	background-color: #ccc;
	height: auto;
}

.results {
	margin-top: 2rem;
}
</style>
