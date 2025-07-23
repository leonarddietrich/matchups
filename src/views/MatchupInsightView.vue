<template>
	<div>
		<h1>Matchup Insight</h1>
		<button id="filterByPlayer" @click="filterByPlayer=!filterByPlayer">
			{{ filterByPlayer ? 'Filter by Opponent' : 'Filter by Player' }}
		</button>

		<div class="selectors">
			<CharacterSelection
				v-bind:allowed-rivals="playerRivals"
				v-bind:selected-rival="selectedPlayerRival"
				v-on:character-selected="updatePlayerRival"
				:class="{ primarySelector: filterByPlayer, secondarySelector: !filterByPlayer }"
			/>

			<div class="divider"></div>

			<CharacterSelection
				v-bind:allowed-rivals="opponentRivals"
				v-bind:selected-rival="selectedOpponentRival"
				v-on:character-selected="updateOpponentRival"
				:class="{ primarySelector: !filterByPlayer, secondarySelector: filterByPlayer }"
			/>
		</div>
		<div class="results">
			<StageInsight :player="selectedPlayerRival" :opponent="selectedOpponentRival"></StageInsight>
		</div>
	</div>
</template>

<script setup lang="ts">
import CharacterSelection from '@/components/CharacterSelection.vue'
import StageInsight from '@/components/StageInsight.vue'
import { computed, ref, watch } from 'vue'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'
import { type RivalName } from '@/scripts/roa2'

const filterByPlayer = ref(true)

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

const selectableRivals = computed(() => {
	const selectableRivals: {
		player: Record<RivalName, Set<RivalName>>,
		opponent: Record<RivalName, Set<RivalName>>
	} = {
		player: {} as Record<RivalName, Set<RivalName>>,
		opponent: {} as Record<RivalName, Set<RivalName>>
	}

	const selectedId = selectionStore.getselectedMatchCollectionId
	if (selectedId === null) {
		return selectableRivals
	}

	const selectedMatchCollection = matchStore.getMatchCollectionById(selectedId)
	if (!selectedMatchCollection) {
		return selectableRivals
	}

	const rounds = selectedMatchCollection.matches.flatMap((match) => match.rounds)
	if (rounds && rounds.length > 0) {
		rounds.forEach( round => {
			const playerRival = round.playerRival
			const opponentRival = round.opponentRival
			if(!selectableRivals.player[playerRival]){
				const rivalSet = new Set<RivalName>()
				rivalSet.add(opponentRival)
				selectableRivals.player[playerRival] = rivalSet
			} else {
				selectableRivals.player[playerRival].add(opponentRival)
			}
			if(!selectableRivals.opponent[opponentRival]){
				const rivalSet = new Set<RivalName>()
				rivalSet.add(playerRival)
				selectableRivals.opponent[opponentRival] = rivalSet
			} else {
				selectableRivals.opponent[opponentRival].add(playerRival)
			}
		})
	}
	return selectableRivals
})

const playerRivals = computed<RivalName[]>(() => {
	if(filterByPlayer.value){
		return Object.keys(selectableRivals.value.player) as RivalName[]
	} else {
		return selectedOpponentRival.value && selectableRivals.value.opponent[selectedOpponentRival.value]
			? Array.from(selectableRivals.value.opponent[selectedOpponentRival.value].values())
			: [] as RivalName[]
	}
})

const opponentRivals = computed<RivalName[]>(() => {
	if(!filterByPlayer.value){
		return Object.keys(selectableRivals.value.opponent)  as RivalName[]
	} else {
		return selectedPlayerRival.value && selectableRivals.value.player[selectedPlayerRival.value]
			? Array.from(selectableRivals.value.player[selectedPlayerRival.value].values())
			: [] as RivalName[]
	}
})


const selectedPlayerRival = computed<RivalName | null>({
	get: () => useSelectionStore().getPlayerCharacter,
	set: (newSelectedRival: RivalName | null) => selectionStore.setPlayerCharacter(newSelectedRival),
})

const selectedOpponentRival = computed<RivalName | null>({
	get: () => useSelectionStore().getOpponentCharacter,
	set: (newSelectedRival: RivalName | null) =>
		selectionStore.setOpponentCharacter(newSelectedRival),
})

watch(playerRivals, (newPlayerRivals) => {
    if (selectedPlayerRival.value && !newPlayerRivals.includes(selectedPlayerRival.value)) {
        // Current selection is not in the new list, select first available or null
        selectedPlayerRival.value = newPlayerRivals.length > 0 ? newPlayerRivals[0] : null
    }
}, { immediate: true })

watch(opponentRivals, (newOpponentRivals) => {
    if (selectedOpponentRival.value && !newOpponentRivals.includes(selectedOpponentRival.value)) {
        // Current selection is not in the new list, select first available or null
        selectedOpponentRival.value = newOpponentRivals.length > 0 ? newOpponentRivals[0] : null
    }
}, { immediate: true })

function updatePlayerRival(newSelectedRival: RivalName | null) {
	selectedPlayerRival.value = newSelectedRival
}
function updateOpponentRival(newSelectedRival: RivalName | null) {
	selectedOpponentRival.value = newSelectedRival
}
</script>

<style scoped>
.selectors {
	display: grid;
	grid-template-columns: 1fr 2px 1fr;
	width: 100%;
	height: 100%;
}
.primarySelector {
	border: 2px solid #42b983;
}
.secondarySelector {
	border: 2px solid transparent;
}

.divider {
	width: 2px;
	/* background-color: #ffd596; */
	height: auto;
}

.results {
	margin-top: 2rem;
}
</style>
