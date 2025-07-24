<template>
	<div>
		<h1>Matchup Insight</h1>

		<!-- Improved Filter Toggle -->
		<div class="filter-mode-toggle">
			<span class="toggle-label">Filter by:</span>
			<div class="toggle-switch" @click="filterByPlayer = !filterByPlayer">
				<div class="toggle-track" :class="{ active: !filterByPlayer }">
					<div class="toggle-option left" :class="{ active: filterByPlayer }">
						<span class="toggle-text">Player</span>
					</div>
					<div class="toggle-option right" :class="{ active: !filterByPlayer }">
						<span class="toggle-text">Opponent</span>
					</div>
					<div class="toggle-slider" :class="{ 'slide-right': !filterByPlayer }"></div>
				</div>
			</div>
		</div>

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
import { type RivalName } from '@/types/roa2Types'

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
.filter-mode-toggle {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin: 1.5rem 0;
	justify-content: center;
}

.toggle-label {
	font-weight: bold;
	color: rgba(255, 255, 255, 0.8);
	font-size: 1rem;
}

.toggle-switch {
	cursor: pointer;
	user-select: none;
}

.toggle-track {
	position: relative;
	width: 240px;
	height: 50px;
	background-color: rgba(0, 0, 0, 0.6);
	border-radius: 25px;
	display: flex;
	overflow: hidden;
	transition: all 0.3s ease;
	border: 2px solid rgba(255, 255, 255, 0.2);
}

.toggle-track.active {
	border-color: #42b983;
}

.toggle-option {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	position: relative;
	z-index: 2;
	transition: all 0.3s ease;
	padding: 0.5rem;
}

.toggle-option.active {
	color: white;
	font-weight: bold;
}

.toggle-option:not(.active) {
	color: rgba(255, 255, 255, 0.6);
}

.toggle-icon {
	font-size: 1.2rem;
}

.toggle-text {
	font-size: 0.9rem;
	font-weight: 600;
}

.toggle-slider {
	position: absolute;
	top: 0;
	left: 0;
	width: 50%;
	height: 100%;
	background: linear-gradient(135deg, #42b983, #369870);
	border-radius: 25px;
	transition: transform 0.3s ease;
	z-index: 1;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.toggle-slider.slide-right {
	transform: translateX(100%);
}

.toggle-switch:hover .toggle-track {
	border-color: #42b983;
	box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.selectors {
	display: grid;
	grid-template-columns: 1fr 2px 1fr;
	width: 100%;
	height: 100%;
	margin-top: 2rem;
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
