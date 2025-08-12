<template>
	<div class="stages-flex">
		<div v-for="stage in stageInsights" :key="stage.name" class="stage-item">
			<div class="icon-container">
				<picture>
					<source :srcset="stage.iconPathWebp" type="image/webp" />
					<img :src="stage.iconPath" :alt="stage.name" class="stage-icon" loading="lazy" />
				</picture>
				<span v-if="stage.timesPlayed > 0" class="win-percentage">
					{{ Math.round(stageInsights.find((s) => s.name == stage.name)?.percentage ?? 0) }}%
				</span>
				<span v-else class="win-percentage">N/A</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'
import type { Round, Stage, Match, RankedMatch } from '@/types/roa2Types'
import { STAGES } from '@/constants'

interface StageInsight extends Stage {
	timesPlayed: number
	wins: number
	percentage: number | undefined
}

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

const player = computed(() => selectionStore.getPlayerCharacter)
const opponent = computed(() => selectionStore.getOpponentCharacter)
const selectedMatchCollectionName = computed(() => selectionStore.getSelectedMatchCollectionName)

const rounds = computed<Round[]>(() => {
	if (!player.value || !opponent.value || !selectedMatchCollectionName.value) {
		return []
	}
	const selectedMatchCollection = matchStore.getMatchCollectionByName(selectedMatchCollectionName.value)

	if (!selectedMatchCollection) return []

	return selectedMatchCollection.matches
		.reduce((acc: Round[], match: Match | RankedMatch) => acc.concat(match.rounds), [] as Round[])
		.filter((round: Round) => round.playerRival === player.value && round.opponentRival === opponent.value)
})

const stageInsights = computed<StageInsight[]>(() => {
	return STAGES.map((stage) => {
		let timesPlayed = 0
		let wins = 0
		for (const round of rounds.value) {
			if (round.stage === stage.name) {
				if (round.won) {
					wins++
				}
				timesPlayed++
			}
		}
		const percentage = timesPlayed > 0 ? (wins / timesPlayed) * 100 : undefined
		return {
			...stage,
			timesPlayed,
			wins,
			percentage,
		} as StageInsight
	})
})
</script>

<style scoped>
.stages-flex {
	display: flex;
	flex-wrap: wrap;
	gap: 20px 2px; /* 20px vertikal, 2px horizontal */
	justify-content: center;
	align-items: flex-start;
}

.stage-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 180px;
}

.icon-container {
	position: relative;
	width: 130px;
	height: 130px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.stage-icon {
	width: 130px;
	height: 130px;
	display: block;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	object-fit: cover;
}

.win-percentage {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 39px;
	background: rgba(0, 0, 0, 0.5);
	color: #fff;
	border-radius: 0 0 12px 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5rem;
	font-weight: bold;
	pointer-events: none;
	white-space: nowrap;
	width: 100%;
}
</style>
