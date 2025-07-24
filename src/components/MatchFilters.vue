<template>
	<div class="filter-container" :class="{ 'has-active-filters': hasActiveFilters, 'filters-expanded': showFilters }">
		<!-- Active Filters Display -->
		<div class="active-filters" v-if="hasActiveFilters">
			<span class="active-filters-label">Active:</span>
			<div class="active-filter-tags">
				<!-- Stages Filters -->
				<div v-if="filters.stages && filters.stages.length > 0" class="filter-category">
					<span class="category-label">Stages:</span>
					<div class="category-items">
						<span
							v-for="stage in sortedActiveStages"
							:key="stage"
							class="filter-tag stage-tag"
							:style="{ backgroundImage: `url(${getStageIcon(stage)})` }"
						>
							{{ stage }}
							<button @click="removeSingleStageFilter(stage)" class="remove-filter">×</button>
						</span>
					</div>
				</div>

				<!-- Player Character Filters -->
				<div v-if="filters.playerCharacter && filters.playerCharacter.length > 0" class="filter-category">
					<span class="category-label">Player:</span>
					<div class="category-items">
						<span
							v-for="rival in sortedActivePlayerCharacters"
							:key="rival"
							class="filter-tag character-tag"
							:style="{ backgroundImage: `url(${getRivalIcon(rival)})` }"
						>
							{{ rival }}
							<button @click="removeSinglePlayerCharacterFilter(rival)" class="remove-filter">×</button>
						</span>
					</div>
				</div>

				<!-- Opponent Character Filters -->
				<div v-if="filters.opponentCharacter && filters.opponentCharacter.length > 0" class="filter-category">
					<span class="category-label">Opponent:</span>
					<div class="category-items">
						<span
							v-for="rival in sortedActiveOpponentCharacters"
							:key="rival"
							class="filter-tag character-tag"
							:style="{ backgroundImage: `url(${getRivalIcon(rival)})` }"
						>
							{{ rival }}
							<button @click="removeSingleOpponentCharacterFilter(rival)" class="remove-filter">×</button>
						</span>
					</div>
				</div>

				<!-- Results Filter -->
				<div v-if="filters.results" class="filter-category">
					<span class="category-label">Results:</span>
					<div class="category-items">
						<span class="filter-tag">
							{{ filters.results }}
							<button @click="clearResultsFilter" class="remove-filter">×</button>
						</span>
					</div>
				</div>

				<!-- Difficulty Filter -->
				<div v-if="filters.difficulty" class="filter-category">
					<span class="category-label">Difficulty:</span>
					<div class="category-items">
						<span class="filter-tag">
							{{ filters.difficulty }}
							<button @click="clearDifficultyFilter" class="remove-filter">×</button>
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Filter Toggle Button -->
		<div class="filter-toggle-section">
			<button @click="toggleFilters" class="filter-toggle-button">
				<span>{{ showFilters ? '▼' : '▶' }}</span>
				<span>Filter Options</span>
			</button>
		</div>

		<!-- Collapsible Filter Options -->
		<div v-show="showFilters" class="filter-options">
			<!-- Stages Filter -->
			<div class="filter-group">
				<label>Stages:</label>
				<div class="checkbox-group">
					<label v-for="stage in availableStages" :key="stage" class="checkbox-label">
						<input
							type="checkbox"
							:value="stage"
							@change="updateStageFilter(stage, ($event.target as HTMLInputElement).checked)"
							:checked="filters.stages?.includes(stage) || false"
						/>
						{{ stage }}
					</label>
				</div>
			</div>

			<!-- Player Character Filter -->
			<div class="filter-group">
				<label>Player Character:</label>
				<div class="checkbox-group">
					<label v-for="rival in availableRivals" :key="rival" class="checkbox-label">
						<input
							type="checkbox"
							:value="rival"
							@change="updatePlayerCharacterFilter(rival, ($event.target as HTMLInputElement).checked)"
							:checked="filters.playerCharacter?.includes(rival) || false"
						/>
						{{ rival }}
					</label>
				</div>
			</div>

			<!-- Opponent Character Filter -->
			<div class="filter-group">
				<label>Opponent Character:</label>
				<div class="checkbox-group">
					<label v-for="rival in availableRivals" :key="rival" class="checkbox-label">
						<input
							type="checkbox"
							:value="rival"
							@change="updateOpponentCharacterFilter(rival, ($event.target as HTMLInputElement).checked)"
							:checked="filters.opponentCharacter?.includes(rival) || false"
						/>
						{{ rival }}
					</label>
				</div>
			</div>			<!-- Results Filter -->
			<div class="filter-group">
				<label>Results:</label>
				<div class="radio-group">
					<label class="radio-label">
						<input
							type="radio"
							name="results"
							value=""
							@change="updateResultsFilter(null)"
							:checked="!filters.results"
						/>
						All
					</label>
					<label class="radio-label">
						<input
							type="radio"
							name="results"
							value="wins"
							@change="updateResultsFilter('wins')"
							:checked="filters.results === 'wins'"
						/>
						Wins Only
					</label>
					<label class="radio-label">
						<input
							type="radio"
							name="results"
							value="losses"
							@change="updateResultsFilter('losses')"
							:checked="filters.results === 'losses'"
						/>
						Losses Only
					</label>
				</div>
			</div>

			<!-- Difficulty Filter -->
			<div class="filter-group">
				<label>Difficulty:</label>
				<div class="radio-group">
					<label class="radio-label">
						<input
							type="radio"
							name="difficulty"
							value=""
							@change="updateDifficultyFilter(null)"
							:checked="!filters.difficulty"
						/>
						All
					</label>
					<label class="radio-label">
						<input
							type="radio"
							name="difficulty"
							value="easy"
							@change="updateDifficultyFilter('easy')"
							:checked="filters.difficulty === 'easy'"
						/>
						Easy (Opponent ELO &lt; Player ELO - 200)
					</label>
					<label class="radio-label">
						<input
							type="radio"
							name="difficulty"
							value="equal"
							@change="updateDifficultyFilter('equal')"
							:checked="filters.difficulty === 'equal'"
						/>
						Equal (ELO ± 200)
					</label>
					<label class="radio-label">
						<input
							type="radio"
							name="difficulty"
							value="hard"
							@change="updateDifficultyFilter('hard')"
							:checked="filters.difficulty === 'hard'"
						/>
						Hard (Opponent ELO &gt; Player ELO + 200)
					</label>
					<label class="radio-label">
						<input
							type="radio"
							name="difficulty"
							value="unknown"
							@change="updateDifficultyFilter('unknown')"
							:checked="filters.difficulty === 'unknown'"
						/>
						Unknown (Unranked matches)
					</label>
				</div>
			</div>

			<!-- Clear Filters -->
			<div class="filter-actions">
				<button @click="clearAllFilters" class="clear-button">Clear All Filters</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { MatchFilters, StageName, RivalName, MatchResult, DifficultyLevel } from '@/types/roa2Types'
import { RIVAL_NAMES, STAGE_NAMES } from '@/constants/roa2'
import { getStageIconPathByName, getRivalIconPathByName } from '@/scripts/roa2'
import { ref, computed } from 'vue'

const props = defineProps<{
	filters: MatchFilters
}>()

const emit = defineEmits<{
	updateFilters: [filters: MatchFilters]
}>()

// Reactive state for showing/hiding filters
const showFilters = ref(false)

// Available options from constants
const availableStages: StageName[] = STAGE_NAMES
const availableRivals: RivalName[] = RIVAL_NAMES

// Computed property to check if any filters are active
const hasActiveFilters = computed(() => {
	return !!(
		(props.filters.stages && props.filters.stages.length > 0) ||
		(props.filters.playerCharacter && props.filters.playerCharacter.length > 0) ||
		(props.filters.opponentCharacter && props.filters.opponentCharacter.length > 0) ||
		props.filters.results ||
		props.filters.difficulty
	)
})

// Computed properties for sorted active filters
const sortedActiveStages = computed(() => {
	if (!props.filters.stages) return []
	return availableStages.filter(stage => props.filters.stages!.includes(stage))
})

const sortedActivePlayerCharacters = computed(() => {
	if (!props.filters.playerCharacter) return []
	return availableRivals.filter(rival => props.filters.playerCharacter!.includes(rival))
})

const sortedActiveOpponentCharacters = computed(() => {
	if (!props.filters.opponentCharacter) return []
	return availableRivals.filter(rival => props.filters.opponentCharacter!.includes(rival))
})

// Helper functions to get icons (using existing utility functions)
function getStageIcon(stageName: StageName): string {
	return getStageIconPathByName(stageName)
}

function getRivalIcon(rivalName: RivalName): string {
	return getRivalIconPathByName(rivalName)
}

function toggleFilters() {
	showFilters.value = !showFilters.value
}

// Individual filter clearing functions for single items
function removeSingleStageFilter(stage: StageName) {
	const currentStages = props.filters.stages || []
	const newStages = currentStages.filter(s => s !== stage)

	emit('updateFilters', {
		...props.filters,
		stages: newStages.length > 0 ? newStages : undefined
	})
}

function removeSinglePlayerCharacterFilter(rival: RivalName) {
	const currentRivals = props.filters.playerCharacter || []
	const newRivals = currentRivals.filter(r => r !== rival)

	emit('updateFilters', {
		...props.filters,
		playerCharacter: newRivals.length > 0 ? newRivals : undefined
	})
}

function removeSingleOpponentCharacterFilter(rival: RivalName) {
	const currentRivals = props.filters.opponentCharacter || []
	const newRivals = currentRivals.filter(r => r !== rival)

	emit('updateFilters', {
		...props.filters,
		opponentCharacter: newRivals.length > 0 ? newRivals : undefined
	})
}

function clearResultsFilter() {
	emit('updateFilters', {
		...props.filters,
		results: undefined
	})
}

function clearDifficultyFilter() {
	emit('updateFilters', {
		...props.filters,
		difficulty: undefined
	})
}

function updateStageFilter(stage: StageName, checked: boolean) {
	const currentStages = props.filters.stages || []
	let newStages: StageName[]

	if (checked) {
		newStages = [...currentStages, stage]
	} else {
		newStages = currentStages.filter(s => s !== stage)
	}

	emit('updateFilters', {
		...props.filters,
		stages: newStages.length > 0 ? newStages : undefined
	})
}

function updatePlayerCharacterFilter(rival: RivalName, checked: boolean) {
	const currentRivals = props.filters.playerCharacter || []
	let newRivals: RivalName[]

	if (checked) {
		newRivals = [...currentRivals, rival]
	} else {
		newRivals = currentRivals.filter(r => r !== rival)
	}

	emit('updateFilters', {
		...props.filters,
		playerCharacter: newRivals.length > 0 ? newRivals : undefined
	})
}

function updateOpponentCharacterFilter(rival: RivalName, checked: boolean) {
	const currentRivals = props.filters.opponentCharacter || []
	let newRivals: RivalName[]

	if (checked) {
		newRivals = [...currentRivals, rival]
	} else {
		newRivals = currentRivals.filter(r => r !== rival)
	}

	emit('updateFilters', {
		...props.filters,
		opponentCharacter: newRivals.length > 0 ? newRivals : undefined
	})
}

function updateResultsFilter(result: MatchResult | null) {
	emit('updateFilters', {
		...props.filters,
		results: result || undefined
	})
}

function updateDifficultyFilter(difficulty: DifficultyLevel | null) {
	emit('updateFilters', {
		...props.filters,
		difficulty: difficulty || undefined
	})
}

function clearAllFilters() {
	emit('updateFilters', {})
}
</script>

<style scoped lang="css">
.filter-container {
	background-color: rgba(0, 0, 0, 0.1);
	padding: 1rem;
	border-radius: 8px;
	margin-bottom: 1rem;
	transition: background-color 0.3s ease;
}

.filter-container.has-active-filters,
.filter-container.filters-expanded {
	background-color: rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.active-filters {
	display: flex;
	align-items: flex-start;
	gap: 0.5rem;
	flex-wrap: wrap;
	margin-bottom: 1rem;
}

.filter-toggle-section {
	display: flex;
	justify-content: center;
	margin-bottom: 1rem;
}

.filter-toggle-button {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background-color: #42b983;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 1rem;
}

.filter-toggle-button:hover {
	background-color: #369870;
}

.active-filters-label {
	font-weight: bold;
	color: #666;
	margin-right: 0.5rem;
	flex-shrink: 0;
}

.filter-container.has-active-filters .active-filters-label,
.filter-container.filters-expanded .active-filters-label {
	color: rgba(255, 255, 255, 0.8);
}

.active-filter-tags {
	display: flex;
	gap: 0.75rem;
	flex-wrap: wrap;
	align-items: flex-start;
	/* Always use vertical stacking for all screen sizes */
	flex-direction: column;
}

.filter-category {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	/* Ensure categories don't grow too wide */
	min-width: 0;
	flex-shrink: 1;
}

.category-label {
	font-size: 0.75rem;
	font-weight: bold;
	color: #666;
	text-transform: uppercase;
}

.filter-container.has-active-filters .category-label,
.filter-container.filters-expanded .category-label {
	color: rgba(255, 255, 255, 0.8);
}

.category-items {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
	/* Ensure items within categories also wrap nicely */
	justify-content: flex-start;
}

/* Additional responsive behavior for very narrow screens */
@media (max-width: 768px) {
	.active-filters {
		flex-direction: column;
		gap: 0.75rem;
	}

	.category-items {
		gap: 0.25rem;
	}

	.filter-tag {
		font-size: 0.8rem;
		padding: 0.2rem 0.4rem;
		max-width: none;
	}
}.filter-tag {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.25rem 0.5rem;
	background-color: #42b983;
	color: white;
	border-radius: 12px;
	font-size: 0.875rem;
	max-width: 200px;
	position: relative;
}

.stage-tag,
.character-tag {
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-blend-mode: overlay;
	background-color: rgba(66, 185, 131, 0.8);
	backdrop-filter: brightness(0.7);
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
	font-weight: bold;
	border: 2px solid rgba(255, 255, 255, 0.3);
}

.remove-filter {
	background: none;
	border: none;
	color: white;
	cursor: pointer;
	font-size: 1rem;
	font-weight: bold;
	padding: 0;
	margin-left: 0.25rem;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0.2);
}

.remove-filter:hover {
	background-color: rgba(255, 255, 255, 0.3);
}

.filter-options {
	margin-top: 1rem;
	border-top: 1px solid rgba(255, 255, 255, 0.2);
	padding-top: 1rem;
}

.filter-group {
	margin-bottom: 1rem;
}

.filter-group label {
	font-weight: bold;
	display: block;
	margin-bottom: 0.5rem;
	color: #333;
}

.filter-container.filters-expanded .filter-group label {
	color: white;
}

.checkbox-group,
.radio-group {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.checkbox-label,
.radio-label {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	font-weight: normal;
	margin: 0;
	padding: 0.25rem 0.5rem;
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 4px;
	cursor: pointer;
	color: #333;
}

.filter-container.filters-expanded .checkbox-label,
.filter-container.filters-expanded .radio-label {
	color: white;
}

.checkbox-label input,
.radio-label input {
	margin: 0;
}

.filter-actions {
	text-align: center;
	padding-top: 1rem;
	border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.clear-button {
	padding: 0.5rem 1rem;
	background-color: #f44336;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.clear-button:hover {
	background-color: #d32f2f;
}
</style>
