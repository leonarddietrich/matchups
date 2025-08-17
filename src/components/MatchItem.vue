<template>
	<div class="match">
		<div>
			<div class="match-header clickable" @click="openModifyModal">
				<div>
					<div>You</div>
					<div v-if="isRankedCollection && 'playerElo' in props.match">{{ props.match.playerElo === -1 ? 'Unranked' : props.match.playerElo }}</div>
				</div>
				<div>
					<div>{{ props.match.opponentName }}</div>
					<div v-if="isRankedCollection && 'opponentElo' in props.match">{{ props.match.opponentElo === -1 ? 'Unranked' : props.match.opponentElo }}</div>
				</div>
			</div>
		</div>
		<div class="match-body clickable" @click="openModifyModal">
			<MatchRoundItem
				v-for="(round, round_index) in displayedRounds"
				:key="props.match.uuid + '_' + round_index"
				v-bind:stage="round.stage"
				:player="round.playerRival"
				:opponent="round.opponentRival"
				:result="round.won"
			/>
		</div>

		<!-- Links Section -->
		<div v-if="props.match.links && props.match.links.length > 0" class="match-links">
			<h4 class="links-title">Links</h4>
			<table class="links-table">
				<tbody>
					<tr v-for="(link, index) in props.match.links" :key="index" class="link-row">
						<td class="link-description">{{ link.text || 'Link' }}</td>
						<td class="link-url">
							<a
								:href="link.link"
								target="_blank"
								rel="noopener noreferrer"
								class="link-anchor"
							>
								{{ link.link }}
							</a>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script lang="ts" setup>
import MatchRoundItem from './MatchRoundItem.vue'
import type { Match, MatchFilters } from '@/types/roa2Types'
import { computed } from 'vue'
import { filterRoundsInMatch } from '@/scripts/matchFilters'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'

const emit = defineEmits(['openModifyModal'])
const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

const props = defineProps<{
	match: Match
	filters?: MatchFilters
}>()

// Check if current collection is ranked to show ELO
const isRankedCollection = computed(() => {
	const collectionName = selectionStore.getSelectedMatchCollectionName
	if (!collectionName) return false

	const currentCollection = matchStore.getMatchCollectionByName(collectionName)
	return currentCollection?.type === 'ranked'
})

function openModifyModal() {
	emit('openModifyModal', props.match)
}
const displayedRounds = computed(() => {
	if (!props.filters) {
		return props.match.rounds
	}
	return filterRoundsInMatch(props.match, props.filters)
})
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

.clickable {
	cursor: pointer;
	transition: background-color 0.2s ease;
}

.clickable:hover {
	background-color: rgba(66, 185, 131, 0.1);
}

/* Links Section Styling */
.match-links {
	margin-top: 1rem;
	padding: 0.75rem;
	background-color: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 6px;
}

.links-title {
	margin: 0 0 0.75rem 0;
	font-size: 1rem;
	color: #42b983;
	font-weight: 600;
}

.links-table {
	width: 100%;
	border-collapse: collapse;
}

.link-row {
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.link-row:last-child {
	border-bottom: none;
}

.link-description {
	padding: 0.5rem 0.75rem 0.5rem 0;
	vertical-align: top;
	width: 35%;
	font-weight: 500;
	color: #e2e8f0;
}

.link-url {
	padding: 0.5rem 0;
	vertical-align: top;
	width: 65%;
}

.link-anchor {
	color: #42b983;
	text-decoration: none;
	word-break: break-all;
	transition: color 0.2s ease;
}

.link-anchor:hover {
	color: #369870;
	text-decoration: underline;
}
</style>
