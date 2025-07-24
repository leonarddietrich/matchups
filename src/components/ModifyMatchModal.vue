<template>
	<BaseModal :show="props.display" @close="handleCancel">
		<template v-slot:header>
			<h3>Modify Match</h3>
		</template>
		<template v-slot:body>
			<div class="modify-match-content">
				<div class="match-details-section">
					<h4>Match Details</h4>

					<div v-if="isRankedCollection" class="form-group">
						<label for="player-elo">Player Elo</label>
						<div class="old-new-container">
							<span class="old-value">old: {{ originalMatch?.playerElo || 'Unranked' }}</span>
							<input
								id="player-elo"
								type="number"
								placeholder="Unranked"
								v-model.number="modifiedMatch.playerElo"
								class="form-input"
								min="0"
							/>
						</div>
					</div>

					<div v-if="isRankedCollection" class="form-group">
						<label for="opponent-elo">Opponent Elo</label>
						<div class="old-new-container">
							<span class="old-value">old: {{ originalMatch?.opponentElo || 'Unranked' }}</span>
							<input
								id="opponent-elo"
								type="number"
								placeholder="Unranked"
								v-model.number="modifiedMatch.opponentElo"
								class="form-input"
								min="0"
							/>
						</div>
					</div>

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
							/>
						</div>
					</div>

					<!-- ELO fields - only show for ranked collections -->
					<div v-if="isRankedCollection" class="elo-section">
						<div class="form-row">
							<div class="form-group">
								<label for="player-elo">Player ELO</label>
								<div class="old-new-container">
									<span class="old-value">old: {{ originalMatch?.playerElo || 'N/A' }}</span>
									<input
										id="player-elo"
										type="number"
										placeholder="1000"
										v-model.number="modifiedMatch.playerElo"
										class="form-input"
										min="0"
									/>
								</div>
							</div>
							<div class="form-group">
								<label for="opponent-elo">Opponent ELO</label>
								<div class="old-new-container">
									<span class="old-value">old: {{ originalMatch?.opponentElo || 'N/A' }}</span>
									<input
										id="opponent-elo"
										type="number"
										placeholder="1000"
										v-model.number="modifiedMatch.opponentElo"
										class="form-input"
										min="0"
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
								class="btn btn-danger btn-small"
							>
								Remove
							</button>
						</div>

						<div class="round-form">
							<div class="form-group">
								<label :for="`stage-${index}`">Stage *</label>
								<div class="old-new-container">
									<span class="old-value" v-if="originalMatch?.rounds[index]">
										old: {{ originalMatch.rounds[index]?.stage || 'None' }}
									</span>
									<span class="old-value" v-else>new round</span>
									<select
										:id="`stage-${index}`"
										v-model="round.stage"
										class="form-input"
										:class="{ 'error': !round.stage && hasAttemptedSave }"
									>
										<option value="">-- Select Stage --</option>
										<option v-for="stage in availableStages" :key="stage" :value="stage">
											{{ stage }}
										</option>
									</select>
								</div>
							</div>

							<div class="form-group">
								<label :for="`player-rival-${index}`">Player Character *</label>
								<div class="old-new-container">
									<span class="old-value" v-if="originalMatch?.rounds[index]">
										old: {{ originalMatch.rounds[index]?.playerRival || 'None' }}
									</span>
									<span class="old-value" v-else>new round</span>
									<select
										:id="`player-rival-${index}`"
										v-model="round.playerRival"
										class="form-input"
										:class="{ 'error': !round.playerRival && hasAttemptedSave }"
									>
										<option value="">-- Select Character --</option>
										<option v-for="rival in availableRivals" :key="rival" :value="rival">
											{{ rival }}
										</option>
									</select>
								</div>
							</div>

							<div class="form-group">
								<label :for="`opponent-rival-${index}`">Opponent Character *</label>
								<div class="old-new-container">
									<span class="old-value" v-if="originalMatch?.rounds[index]">
										old: {{ originalMatch.rounds[index]?.opponentRival || 'None' }}
									</span>
									<span class="old-value" v-else>new round</span>
									<select
										:id="`opponent-rival-${index}`"
										v-model="round.opponentRival"
										class="form-input"
										:class="{ 'error': !round.opponentRival && hasAttemptedSave }"
									>
										<option value="">-- Select Character --</option>
										<option v-for="rival in availableRivals" :key="rival" :value="rival">
											{{ rival }}
										</option>
									</select>
								</div>
							</div>

							<div class="form-group checkbox-group">
								<label :for="`round-won-${index}`" class="checkbox-label">
									<span class="old-value" v-if="originalMatch?.rounds[index]">
										old: {{ originalMatch.rounds[index]?.won ? 'Won' : 'Lost' }}
									</span>
									<span class="old-value" v-else>new round</span>
									<input
										:id="`round-won-${index}`"
										type="checkbox"
										v-model="round.won"
										class="checkbox-input"
									/>
									Round Won
								</label>
							</div>
						</div>
					</div>

					<button
						@click="addRound"
						:disabled="modifiedMatch.rounds.length >= maxRoundsAllowed"
						class="btn btn-secondary btn-add-round"
						:class="{ 'btn-disabled': modifiedMatch.rounds.length >= maxRoundsAllowed }"
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
								class="btn btn-danger btn-small"
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

					<button @click="addLink" class="btn btn-secondary btn-add-link">
						+ Add Link
					</button>
				</div>
			</div>
		</template>
		<template v-slot:footer>
			<button @click="handleCancel" class="btn btn-secondary">Cancel</button>
			<button @click="deleteMatch" class="btn btn-danger">Delete Match</button>
			<button
				:disabled="!isFormValid"
				@click="saveMatch"
				class="btn btn-primary"
			>
				Save Changes
			</button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import type { Round, StageName, RivalName, Match, RankedMatch } from '@/types/roa2Types'
import { RIVAL_NAMES, STAGE_NAMES } from '@/constants/roa2'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

const emit = defineEmits(['closeModifyMatchModal'])

const props = defineProps<{
	display: boolean
	match?: Match | null
}>()

// Keep original match for comparison
const originalMatch = ref<Match | null>(null)

// Modified match data (working copy)
const modifiedMatch = ref<Match>({
	id: 0,
	playerElo: 0,
	opponentElo: 0,
	opponentName: '',
	rounds: [],
	links: []
})

const hasAttemptedSave = ref<boolean>(false)

// Available options
const availableStages: StageName[] = STAGE_NAMES
const availableRivals: RivalName[] = RIVAL_NAMES

// Check if current collection is ranked
const isRankedCollection = computed(() => {
	const collectionId = selectionStore.getselectedMatchCollectionId
	if (!collectionId) return false

	const currentCollection = matchStore.getMatchCollectionById(collectionId)
	return currentCollection?.type === 'ranked'
})

// Get maximum rounds allowed for current collection type
const maxRoundsAllowed = computed(() => {
	const collectionId = selectionStore.getselectedMatchCollectionId
	if (!collectionId) return 3

	const currentCollection = matchStore.getMatchCollectionById(collectionId)
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
		won: false
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

const isFormValid = computed(() => {
	const hasOpponentName = modifiedMatch.value.opponentName.trim() !== ''
	const allRoundsValid = modifiedMatch.value.rounds.every(round =>
		round.stage && round.playerRival && round.opponentRival
	)
	return hasOpponentName && allRoundsValid
})

function saveMatch() {
	hasAttemptedSave.value = true

	if (!isFormValid.value) {
		alert('Please fill in all required fields.')
		return
	}

	const collectionId = selectionStore.getselectedMatchCollectionId
	if (!collectionId) {
		alert('No match collection selected.')
		return
	}

	const currentCollection = matchStore.getMatchCollectionById(collectionId)
	if (!currentCollection) {
		alert('Selected match collection not found.')
		return
	}

	// Filter out empty links and create the appropriate match type
	const finalMatch = isRankedCollection.value
		? {
			...modifiedMatch.value,
			playerElo: modifiedMatch.value.playerElo || 1000,
			opponentElo: modifiedMatch.value.opponentElo || 1000,
			links: modifiedMatch.value.links.filter(link => link.text.trim() !== '' || link.link.trim() !== '')
		} as RankedMatch
		: {
			...modifiedMatch.value,
			links: modifiedMatch.value.links.filter(link => link.text.trim() !== '' || link.link.trim() !== '')
		} as Match

	// Update the match in the collection
	const updatedMatches = currentCollection.matches.map(match =>
		match.id === finalMatch.id ? finalMatch : match
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

	const collectionId = selectionStore.getselectedMatchCollectionId
	if (!collectionId) {
		alert('No match collection selected.')
		return
	}

	const currentCollection = matchStore.getMatchCollectionById(collectionId)
	if (!currentCollection) {
		alert('Selected match collection not found.')
		return
	}

	// Remove the match from the collection
	const updatedMatches = currentCollection.matches.filter(match => match.id !== props.match!.id)

	const updatedCollection = {
		...currentCollection,
		matches: updatedMatches,
		updatedAt: new Date().toISOString()
	}

	// Save the updated collection back to storage
	matchStore.updateMatchCollection(updatedCollection)

	console.log('Match deleted:', props.match.id)

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
		id: 0,
		playerElo: 0,
		opponentElo: 0,
		opponentName: '',
		rounds: [],
		links: []
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

.checkbox-group {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.checkbox-label {
	display: flex !important;
	align-items: center;
	cursor: pointer;
	margin-bottom: 0 !important;
	margin-top: 0.5rem;
}

.checkbox-input {
	width: auto !important;
	margin-right: 0.5rem;
	transform: scale(1.2);
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

.round-form,
.link-form {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
}

.round-form .checkbox-group {
	grid-column: span 2;
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

.btn-disabled {
	background-color: #666 !important;
	color: #999 !important;
	cursor: not-allowed !important;
}

.btn-disabled:hover {
	background-color: #666 !important;
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
