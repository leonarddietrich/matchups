<template>
	<BaseModal :show="props.display" @close="handleCancel">
		<template v-slot:header>
			<h3>Modify Match</h3>
		</template>
		<template v-slot:body>
			<div class="modify-match-content">
				<div class="match-details-section">
					<h4>Match Details</h4>

					<div class="form-group">
						<label for="opponent-name">Opponent Name *</label>
						<div class="old-new-container">
							<span class="old-value">old: "{{ originalMatch?.opponentName }}"</span>
							<input
								id="opponent-name"
								type="text"
								placeholder="Enter opponent name"
								v-model="modifiedMatch.opponentName"
								class="form-input"
								:class="{ 'error': !modifiedMatch.opponentName.trim() && hasAttemptedSave }"
								list="opponent-suggestions"
							/>
							<datalist id="opponent-suggestions">
								<option v-for="name in opponentSuggestions" :key="name" :value="name"></option>
							</datalist>
						</div>
					</div>

				<!-- ELO fields - only show for ranked collections -->
				<div v-if="isRankedCollection" class="elo-section">
					<div class="form-row">
						<div class="form-group">
							<label for="player-elo">Player ELO</label>
							<div class="old-new-container">
								<span class="old-value">old: {{ getEloDisplayValue(originalMatch, 'playerElo') }}</span>
								<input
									id="player-elo"
									type="number"
									placeholder="-1 for unranked"
									:value="getEloValue(modifiedMatch, 'playerElo') || 0"
									@input="setEloValue(modifiedMatch, 'playerElo', Number(($event.target as HTMLInputElement).value))"
									class="form-input"
								/>
							</div>
						</div>
						<div class="form-group">
							<label for="opponent-elo">Opponent ELO</label>
							<div class="old-new-container">
								<span class="old-value">old: {{ getEloDisplayValue(originalMatch, 'opponentElo') }}</span>
								<input
									id="opponent-elo"
									type="number"
									placeholder="-1 for unranked"
									:value="getEloValue(modifiedMatch, 'opponentElo') || 0"
									@input="setEloValue(modifiedMatch, 'opponentElo', Number(($event.target as HTMLInputElement).value))"
									class="form-input"
								/>
							</div>
						</div>
					</div>
				</div>
				</div>

				<div class="rounds-section">
					<h4>Rounds</h4>
					<div v-for="(round, index) in modifiedMatch.rounds" :key="`round-${index}`" class="round-item">
						<div class="round-header">
							<h5>Round {{ index + 1 }}</h5>
							<button
								v-if="modifiedMatch.rounds.length > 1"
								@click="removeRound(index)"
								class="u-btn u-btn--danger u-pill u-btn--sm"
							>
								Remove
							</button>
						</div>

						<div class="round-form-vertical">
							<!-- Stage Selection -->
							<div class="form-group">
								<label>Stage *</label>
								<div class="old-new-container">
									<span class="old-value" v-if="originalMatch?.rounds[index]">
										old: {{ originalMatch.rounds[index]?.stage || 'None' }}
									</span>
									<span class="old-value" v-else>new round</span>
									<div :class="{ 'error': !round.stage && hasAttemptedSave }">
										<SingleSelection
											type="stages"
											v-model="round.stage"
										/>
									</div>
								</div>
							</div>

							<!-- Character Selection Row -->
							<div class="character-selection-row">
								<div class="form-group">
									<label>Player Character *</label>
									<div class="old-new-container">
										<span class="old-value" v-if="originalMatch?.rounds[index]">
											old: {{ originalMatch.rounds[index]?.playerRival || 'None' }}
										</span>
										<span class="old-value" v-else>new round</span>
										<div :class="{ 'error': !round.playerRival && hasAttemptedSave }">
											<SingleSelection
												type="characters"
												v-model="round.playerRival"
											/>
										</div>
									</div>
								</div>

								<div class="form-group">
									<label>Opponent Character *</label>
									<div class="old-new-container">
										<span class="old-value" v-if="originalMatch?.rounds[index]">
											old: {{ originalMatch.rounds[index]?.opponentRival || 'None' }}
										</span>
										<span class="old-value" v-else>new round</span>
										<div :class="{ 'error': !round.opponentRival && hasAttemptedSave }">
											<SingleSelection
												type="characters"
												v-model="round.opponentRival"
												:isOpponent="true"
											/>
										</div>
									</div>
								</div>
							</div>

							<!-- Result Selection -->
							<div class="form-group">
								<label>Round Result *</label>
								<div class="old-new-container">
									<span class="old-value" v-if="originalMatch?.rounds[index]">
										old: {{ originalMatch.rounds[index]?.won ? 'Won' : 'Lost' }}
									</span>
									<span class="old-value" v-else>new round</span>
									<div class="result-buttons">
										<button
											type="button"
											@click="round.won = true"
											class="result-button win-button"
											:class="{ 'selected': round.won === true }"
										>
											Win
										</button>
										<button
											type="button"
											@click="round.won = false"
											class="result-button loss-button"
											:class="{ 'selected': round.won === false }"
										>
											Loss
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<button
						@click="addRound"
						:disabled="modifiedMatch.rounds.length >= maxRoundsAllowed"
						class="u-btn u-btn--secondary u-pill btn-add-round"
					>
						+ Add Round
						<span v-if="modifiedMatch.rounds.length >= maxRoundsAllowed" class="disabled-hint">
							({{ maxRoundsAllowed }} round limit)
						</span>
					</button>
				</div>

				<div class="links-section">
					<h4>Links</h4>
					<div v-for="(link, index) in modifiedMatch.links" :key="`link-${index}`" class="link-item">
						<div class="link-header">
							<h5>Link {{ index + 1 }}</h5>
							<button
								@click="removeLink(index)"
								class="u-btn u-btn--danger u-pill u-btn--sm"
							>
								Remove
							</button>
						</div>

						<div class="link-form">
							<div class="form-group">
								<label :for="`link-text-${index}`">Link Title</label>
								<div class="old-new-container">
									<span class="old-value" v-if="originalMatch?.links[index]">
										old: "{{ originalMatch.links[index]?.text || 'Empty' }}"
									</span>
									<span class="old-value" v-else>new link</span>
									<input
										:id="`link-text-${index}`"
										type="text"
										placeholder="e.g., Match Video, Notes, Analysis"
										v-model="link.text"
										class="form-input"
									/>
								</div>
							</div>

							<div class="form-group">
								<label :for="`link-url-${index}`">URL</label>
								<div class="old-new-container">
									<span class="old-value" v-if="originalMatch?.links[index]">
										old: "{{ originalMatch.links[index]?.link || 'Empty' }}"
									</span>
									<span class="old-value" v-else>new link</span>
									<input
										:id="`link-url-${index}`"
										type="url"
										placeholder="https://..."
										v-model="link.link"
										class="form-input"
									/>
								</div>
							</div>
						</div>
					</div>

					<button @click="addLink" class="u-btn u-btn--secondary u-pill btn-add-link">
						+ Add Link
					</button>
				</div>
			</div>
		</template>
		<template v-slot:footer>
			<button @click="handleCancel" class="u-btn u-btn--secondary u-pill">Cancel</button>
			<button @click="deleteMatch" class="u-btn u-btn--danger u-pill">Delete Match</button>
			<button
				:disabled="!isFormValid"
				@click="saveMatch"
				class="u-btn u-btn--primary u-pill"
			>
				Save Changes
			</button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import SingleSelection from './SingleSelection.vue'
import type { Round, StageName, RivalName, Match, RankedMatch } from '@/types/roa2Types'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'

// Type guards
function isRankedMatch(match: Match | RankedMatch): match is RankedMatch {
	return 'playerElo' in match && 'opponentElo' in match
}

// Helper function to get ELO value safely
function getEloValue(match: Match | RankedMatch | null, field: 'playerElo' | 'opponentElo'): number | undefined {
	if (!match || !isRankedMatch(match)) return undefined
	return match[field]
}

// Helper function to display ELO value safely
function getEloDisplayValue(match: Match | RankedMatch | null, field: 'playerElo' | 'opponentElo'): string {
	const value = getEloValue(match, field)
	if (value === undefined || value === null) return 'N/A'
	if (value === -1) return 'Unranked'
	return value.toString()
}

// Helper function to set ELO value safely
function setEloValue(match: Match | RankedMatch, field: 'playerElo' | 'opponentElo', value: number): void {
	if (isRankedMatch(match)) {
		match[field] = value
	}
}

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

const emit = defineEmits(['closeModifyMatchModal'])

const props = defineProps<{
	display: boolean
	match?: Match | null
}>()

// Keep original match for comparison
const originalMatch = ref<Match | RankedMatch | null>(null)

// Modified match data (working copy)
const modifiedMatch = ref<Match | RankedMatch>({
	uuid: '',
	opponentName: '',
	rounds: [],
	links: [],
	// RankedMatch fields (optional for Match, but required for RankedMatch)
	playerElo: -1,
	opponentElo: -1,
	createdAt: '',
	updatedAt: ''
})

const hasAttemptedSave = ref<boolean>(false)

// Check if current collection is ranked
const isRankedCollection = computed(() => {
	const collectionName = selectionStore.getSelectedMatchCollectionName
	if (!collectionName) return false

	const currentCollection = matchStore.getMatchCollectionByName(collectionName)
	return currentCollection?.type === 'ranked'
})

// Get maximum rounds allowed for current collection type
const maxRoundsAllowed = computed(() => {
	const collectionName = selectionStore.getSelectedMatchCollectionName
	if (!collectionName) return 3

	const currentCollection = matchStore.getMatchCollectionByName(collectionName)
	if (!currentCollection) return 3

	switch (currentCollection.type) {
		case 'ranked':
		case 'casual':
			return 3
		case 'tournament':
			return 5
		case 'friendly':
			return 10 // Practical limit, but no real restriction
		default:
			return 3
	}
})

const opponentSuggestions = computed(() => {
	const collectionName = selectionStore.getSelectedMatchCollectionName
	if (!collectionName) return []

	const currentCollection = matchStore.getMatchCollectionByName(collectionName)
	if (!currentCollection) return []

	return currentCollection.matches
		.map(match => match.opponentName)
		.filter((name, index, self) => name && self.indexOf(name) === index)
		.sort()
})

const isFormValid = computed(() => {
	const hasOpponentName = modifiedMatch.value.opponentName.trim() !== ''
	const allRoundsValid = modifiedMatch.value.rounds.every(round =>
		round.stage && round.playerRival && round.opponentRival && round.won !== undefined
	)
	return hasOpponentName && allRoundsValid
})

// Watch for prop changes to initialize the form
watch(() => props.match, (newMatch) => {
	if (newMatch) {
		originalMatch.value = { ...newMatch }
		modifiedMatch.value = {
			...newMatch,
			rounds: newMatch.rounds.map(round => ({ ...round })),
			links: newMatch.links.map(link => ({ ...link }))
		}
	}
}, { immediate: true })

function createEmptyRound(): Round {
	return {
		stage: '' as StageName,
		playerRival: '' as RivalName,
		opponentRival: '' as RivalName,
		won: undefined as unknown as boolean // Force explicit selection
	}
}

function addRound() {
	if (modifiedMatch.value.rounds.length >= maxRoundsAllowed.value) {
		return // Don't add more rounds than allowed
	}
	modifiedMatch.value.rounds.push(createEmptyRound())
}

function removeRound(index: number) {
	if (modifiedMatch.value.rounds.length > 1) {
		modifiedMatch.value.rounds.splice(index, 1)
	}
}

function addLink() {
	modifiedMatch.value.links.push({ text: '', link: '' })
}

function removeLink(index: number) {
	modifiedMatch.value.links.splice(index, 1)
}

function saveMatch() {
	hasAttemptedSave.value = true

	if (!isFormValid.value) {
		alert('Please fill in all required fields.')
		return
	}

	const collectionName = selectionStore.getSelectedMatchCollectionName
	if (!collectionName) {
		alert('No match collection selected.')
		return
	}

	const currentCollection = matchStore.getMatchCollectionByName(collectionName)
	if (!currentCollection) {
		alert('Selected match collection not found.')
		return
	}

	// Filter out empty links and create the appropriate match type
	const finalMatch = isRankedCollection.value
		? {
			...modifiedMatch.value,
			playerElo: (getEloValue(modifiedMatch.value, 'playerElo') == null || getEloValue(modifiedMatch.value, 'playerElo')! < 0) ? -1 : getEloValue(modifiedMatch.value, 'playerElo')!,
			opponentElo: (getEloValue(modifiedMatch.value, 'opponentElo') == null || getEloValue(modifiedMatch.value, 'opponentElo')! < 0) ? -1 : getEloValue(modifiedMatch.value, 'opponentElo')!,
			links: modifiedMatch.value.links.filter(link => link.text.trim() !== '' || link.link.trim() !== '')
		} as RankedMatch
		: {
			...modifiedMatch.value,
			links: modifiedMatch.value.links.filter(link => link.text.trim() !== '' || link.link.trim() !== '')
		} as Match

	// Update the match in the collection
	const updatedMatches = currentCollection.matches.map((match: Match | RankedMatch) =>
		match.uuid === finalMatch.uuid ? finalMatch : match
	)

	const updatedCollection = {
		...currentCollection,
		matches: updatedMatches,
		updatedAt: new Date().toISOString()
	}

	// Save the updated collection back to storage
	matchStore.updateMatchCollection(updatedCollection)

	console.log('Match updated:', finalMatch)

	// Close modal
	emit('closeModifyMatchModal')
	resetForm()
}

function deleteMatch() {
	// Check if match exists
	if (!props.match) {
		alert('No match to delete.')
		return
	}

	// Show confirmation dialog
	const confirmed = confirm('Are you sure you want to delete this match? This action cannot be undone.')
	if (!confirmed) {
		return
	}

	const collectionName = selectionStore.getSelectedMatchCollectionName
	if (!collectionName) {
		alert('No match collection selected.')
		return
	}

	const currentCollection = matchStore.getMatchCollectionByName(collectionName)
	if (!currentCollection) {
		alert('Selected match collection not found.')
		return
	}

	// Remove the match from the collection
	const updatedMatches = currentCollection.matches.filter((match: Match | RankedMatch) => match.uuid !== props.match!.uuid)

	const updatedCollection = {
		...currentCollection,
		matches: updatedMatches,
		updatedAt: new Date().toISOString()
	}

	// Save the updated collection back to storage
	matchStore.updateMatchCollection(updatedCollection)

	console.log('Match deleted:', props.match.uuid)

	// Close modal
	emit('closeModifyMatchModal')
	resetForm()
}

function handleCancel() {
	emit('closeModifyMatchModal')
	resetForm()
}

function resetForm() {
	hasAttemptedSave.value = false
	originalMatch.value = null
	modifiedMatch.value = {
		uuid: '',
		opponentName: '',
		rounds: [],
		links: [],
		playerElo: -1,
		opponentElo: -1,
		createdAt: '',
		updatedAt: ''
	}
}
</script>

<style scoped lang="css">
/* Custom modal size for ModifyMatchModal */
:deep(.modal-container) {
	width: 800px !important;
	max-width: 95vw !important;
}

.modify-match-content {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.match-details-section,
.rounds-section,
.links-section {
	padding: 1rem;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 8px;
	background-color: rgba(255, 255, 255, 0.1);
}

.match-details-section h4,
.rounds-section h4,
.links-section h4 {
	margin: 0 0 1rem 0;
	color: #42b983;
	font-size: 1.1rem;
}

.old-new-container {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.old-value {
	font-size: 0.85rem;
	color: #94a3b8;
	font-style: italic;
	padding: 0.25rem 0;
}

/* Round form layouts */
.round-form-vertical {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.character-selection-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
}

/* Icon selection styles - updated for SingleSelection component */
.error :deep(.selection-grid) {
	background-color: rgba(255, 68, 68, 0.1);
	box-shadow: 0 0 0 2px #ff4444;
}

/* Result buttons */
.result-buttons {
	display: flex;
	gap: 1rem;
	justify-content: center;
}

.result-button {
	flex: 1;
	padding: 0.75rem 1.5rem;
	border: 2px solid rgba(255, 255, 255, 0.2);
	border-radius: 8px;
	background-color: rgba(255, 255, 255, 0.05);
	color: #fff;
	font-weight: bold;
	cursor: pointer;
	transition: all 0.2s ease;
}

.result-button:hover {
	border-color: rgba(255, 255, 255, 0.4);
	background-color: rgba(255, 255, 255, 0.1);
}

.result-button.selected {
	border-color: #42b983;
	background-color: rgba(66, 185, 131, 0.2);
}

.win-button.selected {
	border-color: #4caf50;
	background-color: rgba(76, 175, 80, 0.2);
	color: #4caf50;
}

.loss-button.selected {
	border-color: #f44336;
	background-color: rgba(244, 67, 54, 0.2);
	color: #f44336;
}

.round-item,
.link-item {
	margin-bottom: 1.5rem;
	padding: 1rem;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 6px;
	background-color: rgba(255, 255, 255, 0.05);
}

.round-header,
.link-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
}

.round-header h5,
.link-header h5 {
	margin: 0;
	color: #42b983;
	font-size: 1rem;
}

.link-form {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
}

.btn-add-round,
.btn-add-link {
	width: 100%;
	margin-top: 1rem;
}

.disabled-hint {
	font-size: 0.8rem;
	opacity: 0.8;
	margin-left: 0.5rem;
}

.elo-section {
	margin-top: 1rem;
	padding: 1rem;
	background-color: rgba(66, 185, 131, 0.1);
	border-radius: 4px;
	border-left: 3px solid #42b983;
}

.elo-section .form-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
}
</style>
