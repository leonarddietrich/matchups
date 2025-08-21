<template>
	<div>
		<h1>Matchup Insight</h1>

		<!-- Rounds Source Selector -->
		<div class="rounds-source">
			<label>
				<span>Source:</span>
				<select v-model="roundsSourceMode">
					<option value="current">Current collection</option>
					<option value="all">All collections</option>
					<option value="byType">By type</option>
					<option value="byPlayer">By opponent name</option>
				</select>
			</label>
			<label v-if="roundsSourceMode === 'byType'" class="inline-control">
				<span>Type:</span>
				<select v-model="selectedType">
					<option value="ranked">ranked</option>
					<option value="casual">casual</option>
					<option value="friendly">friendly</option>
					<option value="tournament">tournament</option>
				</select>
			</label>
			<label v-if="roundsSourceMode === 'byPlayer'" class="inline-control">
				<span>Opponent:</span>
				<input v-model.trim="selectedOpponentName" type="text" placeholder="Enter opponent name" list="opponent-names" />
				<datalist id="opponent-names">
					<option v-for="name in opponentNameOptions" :key="name" :value="name"></option>
				</datalist>
			</label>
		</div>

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
				:isOpponent="true"
			/>
		</div>
		<div class="results">
			<div class="stat-field accent" role="status" aria-live="polite">
				<span class="stat-label">Total Win Rate:</span>
				<span class="stat-value">{{ Math.round(totalWinRate ?? 0) }}%</span>
				<span class="stat-sub">( {{ totalRoundsPlayed ?? 0 }} / {{ totalRoundsWon ?? 0 }} )</span>
			</div>
			<StageInsight :stage-performance="stagePerformances"></StageInsight>
		</div>
	</div>
</template>

<script setup lang="ts">
import CharacterSelection from '@/components/CharacterSelection.vue'
import StageInsight from '@/components/StageInsight.vue'
import { computed, ref, watch } from 'vue'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'
import type { RivalName, Round, MatchType, Match, RankedMatch, StagePerformance } from '@/types/roa2Types'
import { STAGES } from '@/constants'

const filterByPlayer = ref(true)

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

type RoundsSourceMode = 'current' | 'all' | 'byType' | 'byPlayer'
const roundsSourceMode = ref<RoundsSourceMode>('current')
const selectedType = ref<MatchType>('ranked')
const selectedOpponentName = ref<string>('')

const allCollections = computed(() => matchStore.getAllMatchCollections)
const selectedCollection = computed(() => {
    const name = selectionStore.getSelectedMatchCollectionName
    return name ? matchStore.getMatchCollectionByName(name) : null
})

const sourceRounds = computed<Round[]>(() => {
    const mode = roundsSourceMode.value
    if (mode === 'current') {
        const col = selectedCollection.value
        if (!col) return []
        return col.matches.flatMap((m: Match | RankedMatch) => m.rounds)
    }
    if (mode === 'all') {
        return allCollections.value.flatMap(c => c.matches).flatMap((m: Match | RankedMatch) => m.rounds)
    }
    if (mode === 'byType') {
        return allCollections.value
            .filter(c => c.type === selectedType.value)
            .flatMap(c => c.matches)
            .flatMap((m: Match | RankedMatch) => m.rounds)
    }
    // byPlayer (opponent name)
	const queryRaw = selectedOpponentName.value.trim()
	if (!queryRaw) return []
	const query = queryRaw.toLowerCase()
    return allCollections.value
        .flatMap(c => c.matches)
		.filter((m: Match | RankedMatch) => m.opponentName.trim().toLowerCase() === query)
        .flatMap((m: Match | RankedMatch) => m.rounds)
})

// Filter rounds further by selected player/opponent
const filteredRounds = computed<Round[]>(() => {
	const p = selectedPlayerRival.value
	const o = selectedOpponentRival.value
	if (!p || !o) return []
	return sourceRounds.value.filter(r => r.playerRival === p && r.opponentRival === o)
})

const stagePerformances = computed<StagePerformance[]>(() => {
	const rounds = filteredRounds.value
	return STAGES.map((stage): StagePerformance => {
		let timesPlayed = 0
		let wins = 0
		for (const r of rounds) {
			if (r.stage === stage.name) {
				timesPlayed++
				if (r.won) wins++
			}
		}
		const percentage = timesPlayed > 0 ? (wins / timesPlayed) * 100 : undefined
		return { ...stage, timesPlayed, wins, percentage }
	})
})

const totalRoundsPlayed = computed(() => stagePerformances.value.reduce((acc, s) => acc + s.timesPlayed, 0))
const totalRoundsWon = computed(() => stagePerformances.value.reduce((acc, s) => acc + s.wins, 0))
const totalWinRate = computed(() => totalRoundsPlayed.value > 0 ? (totalRoundsWon.value / totalRoundsPlayed.value) * 100 : 0)

const opponentNameOptions = computed<string[]>(() => {
	const names = new Set<string>()
	allCollections.value.forEach(c => {
		c.matches.forEach((m: Match | RankedMatch) => {
			if (m.opponentName && typeof m.opponentName === 'string') {
				names.add(m.opponentName.trim())
			}
		})
	})
	return Array.from(names).sort((a, b) => a.localeCompare(b))
})

const selectableRivals = computed(() => {
	const result: {
		player: Record<RivalName, Set<RivalName>>,
		opponent: Record<RivalName, Set<RivalName>>
	} = { player: {} as Record<RivalName, Set<RivalName>>, opponent: {} as Record<RivalName, Set<RivalName>> }

	const r = sourceRounds.value
	r.forEach(round => {
		const p = round.playerRival
		const o = round.opponentRival
		if (!result.player[p]) result.player[p] = new Set<RivalName>()
		if (!result.opponent[o]) result.opponent[o] = new Set<RivalName>()
		result.player[p].add(o)
		result.opponent[o].add(p)
	})
	return result
})

const playerRivals = computed<RivalName[]>(() => {
	if (filterByPlayer.value) {
		return Object.keys(selectableRivals.value.player) as RivalName[]
	} else {
		return selectedOpponentRival.value && selectableRivals.value.opponent[selectedOpponentRival.value]
			? Array.from(selectableRivals.value.opponent[selectedOpponentRival.value].values())
			: [] as RivalName[]
	}
})

const opponentRivals = computed<RivalName[]>(() => {
	if (!filterByPlayer.value) {
		return Object.keys(selectableRivals.value.opponent) as RivalName[]
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
	const current = selectedPlayerRival.value
	if (!current || !newPlayerRivals.includes(current)) {
		// Ensure a valid selection when list changes
		selectedPlayerRival.value = newPlayerRivals.length > 0 ? newPlayerRivals[0] : null
	}
}, { immediate: true })

watch(opponentRivals, (newOpponentRivals) => {
	const current = selectedOpponentRival.value
	if (!current || !newOpponentRivals.includes(current)) {
		// Ensure a valid selection when list changes
		selectedOpponentRival.value = newOpponentRivals.length > 0 ? newOpponentRivals[0] : null
	}
}, { immediate: true })

function updatePlayerRival(newSelectedRival: RivalName | null) {
	selectedPlayerRival.value = newSelectedRival
}
function updateOpponentRival(newSelectedRival: RivalName | null) {
	selectedOpponentRival.value = newSelectedRival
}

// Ensure a player and opponent are always selected when there are rounds
watch(sourceRounds, (r) => {
	if (!r || r.length === 0) return
	// Nudge watchers by resetting to null if invalid, then rely on watchers to pick defaults
	if (!selectedPlayerRival.value) {
		const list = playerRivals.value
		if (list.length > 0) selectedPlayerRival.value = list[0]
	}
	if (!selectedOpponentRival.value) {
		const list = opponentRivals.value
		if (list.length > 0) selectedOpponentRival.value = list[0]
	}
}, { immediate: true })
</script>

<style scoped>
.rounds-source {
	display: flex;
	gap: 1rem;
	align-items: center;
	justify-content: center;
}
.inline-control {
	display: inline-flex;
	gap: 0.5rem;
	align-items: center;
}
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

.stat-field {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px 12px;
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	width: fit-content;
	margin: 0 auto 16px;
}

.stat-field .stat-label {
	color: #a0aec0;
	font-size: 0.95rem;
	line-height: 1;
}

.stat-field .stat-value {
	color: #e2e8f0;
	font-weight: 800;
	font-size: 1.25rem;
	line-height: 1;
}

.stat-field .stat-sub {
	color: #94a3b8;
	font-size: 0.95rem;
	line-height: 1;
}

.stat-field.accent {
	border-color: rgba(0, 189, 126, 0.6);
	box-shadow: 0 0 0 1px rgba(0, 189, 126, 0.15) inset;
}
</style>
