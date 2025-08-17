<template>
	<BaseModal :show="props.display" @close="$emit('closeAddMatchModal')">
		<template v-slot:header>
			<h3>Add New Match</h3>
		</template>
		<template v-slot:body>
			<div class="add-match-content">
				<div class="match-details-section">
					<h4>Match Details</h4>
					<div v-if="isRankedCollection" class="form-group">
						<label for="player-elo">Player Elo</label>
						<input
							id="player-elo"
							type="number"
							placeholder="-1 for unranked"
							v-model.number="playerElo"
							class="form-input"
						/>
						<span class="helper-text">Enter -1 or negative number for unranked</span>
					</div>

					<div v-if="isRankedCollection" class="form-group">
						<label for="opponent-elo">Opponent Elo</label>
						<input
							id="opponent-elo"
							type="number"
							placeholder="-1 for unranked"
							v-model.number="opponentElo"
							class="form-input"
						/>
						<span class="helper-text">Enter -1 or negative number for unranked</span>
					</div>

					<div class="form-group">
						<label for="opponent-name">Opponent Name *</label>
						<input
							id="opponent-name"
							type="text"
							placeholder="Enter opponent name"
							v-model="opponentName"
							class="form-input"
							:class="{ 'error': !opponentName.trim() && hasAttemptedSave }"
						/>
					</div>
				</div>

				<div class="rounds-section">
					<h4>Rounds</h4>
					<div v-for="(round, index) in rounds" :key="index" class="round-item">
						<div class="round-header">
							<h5>Round {{ index + 1 }}</h5>
							<button
								v-if="rounds.length > 1"
								@click="removeRound(index)"
								class="btn btn-danger btn-small"
							>
								Remove
							</button>
						</div>

						<div class="round-form-vertical">
							<!-- Stage Selection -->
							<div class="form-group">
								<label>Stage *</label>
								<div :class="{ 'error': !round.stage && hasAttemptedSave }">
									<SingleSelection
										type="stages"
										v-model="round.stage"
									/>
								</div>
							</div>

							<!-- Character Selection Row -->
							<div class="character-selection-row">
								<div class="form-group">
									<label>Player Character *</label>
									<div :class="{ 'error': !round.playerRival && hasAttemptedSave }">
										<SingleSelection
											type="characters"
											v-model="round.playerRival"
										/>
									</div>
								</div>

								<div class="form-group">
									<label>Opponent Character *</label>
									<div :class="{ 'error': !round.opponentRival && hasAttemptedSave }">
										<SingleSelection
											type="characters"
											v-model="round.opponentRival"
											:isOpponent="true"
										/>
									</div>
								</div>
							</div>

							<!-- Result Selection -->
							<div class="form-group">
								<label>Round Result *</label>
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

					<button
						@click="addRound"
						class="btn btn-secondary btn-add-round"
						:disabled="rounds.length >= maxRoundsAllowed"
					>
						+ Add Round ({{ rounds.length }}/{{ maxRoundsAllowed }})
					</button>
				</div>

				<div class="links-section">
					<h4>Links</h4>
					<div v-for="(link, index) in links" :key="index" class="link-item">
						<div class="link-header">
							<h5>Link {{ index + 1 }}</h5>
							<button
								@click="removeLink(index)"
								class="btn btn-danger btn-small"
							>
								Remove
							</button>
						</div>

						<div class="link-form">
							<div class="form-group">
								<label :for="`link-text-${index}`">Link Title</label>
								<input
									:id="`link-text-${index}`"
									type="text"
									placeholder="e.g., Match Video, Notes, Analysis"
									v-model="link.text"
									class="form-input"
								/>
							</div>

							<div class="form-group">
								<label :for="`link-url-${index}`">URL</label>
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

					<button @click="addLink" class="btn btn-secondary btn-add-link">
						+ Add Link
					</button>
				</div>
			</div>
		</template>
		<template v-slot:footer>
			<button @click="$emit('closeAddMatchModal')" class="btn btn-secondary">Cancel</button>
			<button
				:disabled="!isFormValid"
				@click="saveMatch"
				class="btn btn-primary"
			>
				Save Match
			</button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import SingleSelection from './SingleSelection.vue'
import type { Round, Match, RankedMatch, StageName, RivalName } from '@/types/roa2Types'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

const emit = defineEmits(['closeAddMatchModal'])

const props = defineProps<{
	display: boolean
}>()

// Form data
const playerElo = ref<number | null>(null)
const opponentElo = ref<number | null>(null)
const opponentName = ref<string>('')
const rounds = ref<Round[]>([createEmptyRound()])
const links = ref<{ text: string; link: string }[]>([])
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

function createEmptyRound(): Round {
	return {
		stage: '' as StageName,
		playerRival: '' as RivalName,
		opponentRival: '' as RivalName,
		won: undefined as unknown as boolean // Force explicit selection
	}
}

function addRound() {
	if (rounds.value.length < maxRoundsAllowed.value) {
		rounds.value.push(createEmptyRound())
	}
}

function removeRound(index: number) {
	if (rounds.value.length > 1) {
		rounds.value.splice(index, 1)
	}
}

function addLink() {
	links.value.push({ text: '', link: '' })
}

function removeLink(index: number) {
	links.value.splice(index, 1)
}

const isFormValid = computed(() => {
	const hasOpponentName = opponentName.value.trim() !== ''
	const allRoundsValid = rounds.value.every(round =>
		round.stage && round.playerRival && round.opponentRival && round.won !== undefined
	)
	return hasOpponentName && allRoundsValid
})

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

	const newMatch: Match | RankedMatch = isRankedCollection.value
		? {
			uuid: crypto.randomUUID(),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			playerElo: (!playerElo.value || playerElo.value < 0) ? -1 : playerElo.value,
			opponentElo: (!opponentElo.value || opponentElo.value < 0) ? -1 : opponentElo.value,
			opponentName: opponentName.value.trim(),
			rounds: [...rounds.value],
			links: links.value.filter(link => link.text.trim() !== '' || link.link.trim() !== '')
		} as RankedMatch
		: {
			uuid: crypto.randomUUID(),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			opponentName: opponentName.value.trim(),
			rounds: [...rounds.value],
			links: links.value.filter(link => link.text.trim() !== '' || link.link.trim() !== '')
		} as Match

	// Add match to collection
	const updatedCollection = {
		...currentCollection,
		matches: [...currentCollection.matches, newMatch],
		updatedAt: new Date().toISOString()
	}

	// Save the updated collection back to storage
	matchStore.updateMatchCollection(updatedCollection)

	console.log('New match added:', newMatch)

	// Reset form
	resetForm()
	emit('closeAddMatchModal')
}

function resetForm() {
	playerElo.value = null
	opponentElo.value = null
	opponentName.value = ''
	rounds.value = [createEmptyRound()]
	links.value = []
	hasAttemptedSave.value = false
}
</script>

<style scoped lang="css">
/* Custom modal size for AddMatchModal */
:deep(.modal-container) {
	width: 700px !important;
	max-width: 90vw !important;
}

.add-match-content {
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

.helper-text {
	font-size: 0.8rem;
	color: #94a3b8;
	margin-top: 0.25rem;
	display: block;
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

.round-form-vertical,
.link-form {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
}

.round-form-vertical {
	grid-template-columns: 1fr;
	gap: 1.5rem;
}

.character-selection-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
}

.btn-small {
	padding: 0.25rem 0.5rem;
	font-size: 0.8rem;
}

.btn-add-round,
.btn-add-link {
	width: 100%;
	margin-top: 1rem;
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
</style>
