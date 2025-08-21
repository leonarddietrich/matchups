<template>
	<!-- Match Collection Details -->
	<div class="collection-details" v-if="matchCollection">
		<h2>{{ matchCollection.name }}</h2>
		<div class="details-grid">
			<div class="detail-item">
				<span class="detail-label">Type:</span>
				<span class="detail-value">{{ matchCollection.type }}</span>
			</div>
			<div class="detail-item">
				<span class="detail-label">Description:</span>
				<span class="detail-value">{{ matchCollection.description || 'No description' }}</span>
			</div>
			<div class="detail-item">
				<span class="detail-label">Match count:</span>
				<span class="detail-value">{{ matchCollection.matches.length }}</span>
			</div>
			<div class="detail-item">
				<span class="detail-label">Created at:</span>
				<span class="detail-value">{{ formatDate(matchCollection.createdAt) }}</span>
			</div>
			<div class="detail-item">
				<span class="detail-label">Updated at:</span>
				<span class="detail-value">{{ formatDate(matchCollection.updatedAt) }}</span>
			</div>
		</div>
	</div>

	<!-- Filter Component -->
	<MatchFilters
		v-if="matchCollection"
		:filters="selectionStore.getCurrentFilters"
		:collectionType="matchCollection.type"
		@updateFilters="handleFiltersUpdate"
	/>

	<div class="match-display" id="matchesDisplay" v-if="matchCollection">
		<MatchItem
			v-for="match in filteredMatches"
			:key="match.uuid"
			:match="match"
			:filters="selectionStore.getCurrentFilters"
			@openModifyModal="openModifyModal"
		/>
	</div>

	<AddMatchModal :display="showAddMatchModal" @closeAddMatchModal="showAddMatchModal = false">
	</AddMatchModal>
	<ModifyMatchModal
		:display="showModifyModal"
		:match="selectedMatch"
		@closeModifyMatchModal="closeModifyModal"
	>
	</ModifyMatchModal>
	<button
		v-if="!(showAddMatchModal || showModifyModal)"
		class="open-modal"
		@click="showAddMatchModal = true"
		style="bottom: 10px; right: 10px"
	>
		<img class="button-icon" src="/src/assets/site/plus.svg" alt="Add Match" />
	</button>
</template>

<script lang="ts" setup>
import MatchItem from '@/components/MatchItem.vue'
import AddMatchModal from '@/components/AddMatchModal.vue'
import ModifyMatchModal from '@/components/ModifyMatchModal.vue'
import MatchFilters from '@/components/MatchFilters.vue'
import { ref, computed } from 'vue'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'
import type { AnyMatchCollection, MatchFilters as MatchFiltersType, Match } from '@/types/roa2Types'
import { filterMatches } from '@/scripts/matchFilters'
import { formatDate } from '@/scripts/utils'

const showAddMatchModal = ref(false)
const showModifyModal = ref(false)
const selectedMatch = ref<Match | null>(null)

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

const matchCollection = computed<AnyMatchCollection | null>(() => {
	const name = selectionStore.getSelectedMatchCollectionName
	if (!name) {
		console.warn('No match collection selected')
		return null
	}
	return matchStore.getMatchCollectionByName(name)
})

const filteredMatches = computed(() => {
	if (!matchCollection.value) {
		return []
	}

	const filters = selectionStore.getCurrentFilters
	// If no filters are active, return all matches
	if (Object.keys(filters).length === 0) {
		return matchCollection.value.matches
	}

	// Apply filters to matches
	return filterMatches(matchCollection.value.matches, filters)
})

function handleFiltersUpdate(newFilters: MatchFiltersType) {
	selectionStore.setFilters(newFilters)
}

function openModifyModal(match: Match) {
	selectedMatch.value = match
	showModifyModal.value = true
}

function closeModifyModal() {
	showModifyModal.value = false
	selectedMatch.value = null
}
</script>

<style scoped lang="css">
.collection-details {
	background-color: rgba(0, 0, 0, 0.3);
	border-radius: 8px;
	padding: 1.5rem;
	margin-bottom: 1rem;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.collection-details h2 {
	margin: 0 0 1rem 0;
	color: white;
	font-size: 1.5rem;
}

.details-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 0.75rem;
}

.detail-item {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.detail-label {
	font-weight: 600;
	color: rgba(255, 255, 255, 0.8);
	font-size: 0.875rem;
}

.detail-value {
	color: white;
	font-size: 1rem;
}

.match-display {
	display: flex;
	border-radius: 8px;
	padding: 1rem;
	gap: 1rem;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	width: 100%;
	max-width: none;
	box-sizing: border-box;
	/* margin: 0 auto; */
}

.open-modal {
	position: fixed;
	width: 40px;
	height: 40px;
	background-color: #42b983;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	filter: invert(1);
}

.button-icon {
	width: 24px;
	height: 24px;
}
</style>
