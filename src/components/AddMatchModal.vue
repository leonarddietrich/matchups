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
						<label for="opponent-name">Opponent Name </label>
						<input
							id="opponent-name"
							type="text"
							placeholder="Enter opponent name"
							v-model="opponentName"
							class="form-input"
							:class="{ 'error': !opponentName.trim() && hasAttemptedSave }"
							list="opponent-suggestions"
						/>
						<datalist id="opponent-suggestions">
							<option v-for="name in opponentSuggestions" :key="name" :value="name"></option>
						</datalist>
					</div>

					<div v-if="recentOpponents.length" class="recent-opponents">
						<span class="recent-label">Recent:</span>
						<button
							v-for="name in recentOpponents"
							:key="name"
							type="button"
							class="opponent-chip"
							:class="{ selected: opponentName.trim() === name }"
							@click="opponentName = name"
						>
							{{ name }}
						</button>
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
								class="u-btn u-btn--danger u-pill u-btn--sm"
							>
								Remove
							</button>
						</div>

						<div class="round-form-vertical">
							<!-- Character Selection Row -->
							<div class="character-selection-row">
								<div class="form-group">
									<label>Player Character</label>
									<div :class="{ 'error': !round.playerRival && hasAttemptedSave }">
										<SingleSelection
											type="characters"
											v-model="round.playerRival"
										/>
									</div>
								</div>

								<div class="form-group">
									<label>Opponent Character</label>
									<div :class="{ 'error': !round.opponentRival && hasAttemptedSave }">
										<SingleSelection
											type="characters"
											v-model="round.opponentRival"
											:isOpponent="true"
										/>
									</div>
								</div>
							</div>

							<!-- Stage Selection -->
							<div class="form-group">
								<label>Stage</label>
								<div :class="{ 'error': !round.stage && hasAttemptedSave }">
									<SingleSelection
										type="stages"
										v-model="round.stage"
										:stageWinrates="getStageWinrates(round)"
									/>
								</div>
							</div>

							<!-- Result Selection -->
							<div class="form-group">
								<label>Round Result</label>
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
						v-if="!isFriendly"
						@click="addRound"
						class="u-btn u-btn--secondary u-pill btn-add-round"
						:disabled="rounds.length >= maxRoundsAllowed || isMatchDecided"
					>
						+ Add Round ({{ rounds.length }}/{{ maxRoundsAllowed }})
						<span v-if="isMatchDecided" class="disabled-hint">(match decided)</span>
					</button>
				</div>

				<div class="links-section">
					<h4>Links</h4>
					<div v-for="(link, index) in links" :key="index" class="link-item">
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

					<button @click="addLink" class="u-btn u-btn--secondary u-pill btn-add-link">
						+ Add Link
					</button>
				</div>
			</div>
		</template>
		<template v-slot:footer>
			<button @click="handleCancel" class="u-btn u-btn--secondary u-pill">Cancel</button>
			<button
				:disabled="!isFormValid"
				@click="rematch"
				class="u-btn u-btn--secondary u-pill"
				title="Save this match and start a new one against the same opponent"
			>
				Rematch
			</button>
			<button
				:disabled="!isFormValid"
				@click="saveMatch"
				class="u-btn u-btn--primary u-pill"
			>
				Save Match
			</button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import BaseModal from './BaseModal.vue'
import SingleSelection from './SingleSelection.vue'
import type { Round, Match, RankedMatch, StageName, RivalName, FriendlyGame, FriendlyMatchCollection } from '@/types/roa2Types'
import { STAGES } from '@/constants/roa2'
import { isFriendlyCollection, getCollectionMatches } from '@/scripts/roa2'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'

const ADD_MATCH_STORAGE_KEY = 'addMatchModalDraft'

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

// Check if current collection is friendly (flat, single-game entries)
const isFriendly = computed(() => {
	const collectionName = selectionStore.getSelectedMatchCollectionName
	if (!collectionName) return false

	const currentCollection = matchStore.getMatchCollectionByName(collectionName)
	return currentCollection?.type === 'friendly'
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

	return getCollectionMatches(currentCollection)
		.map(match => match.opponentName)
		.filter((name, index, self) => name && self.indexOf(name) === index)
		.sort()
})

// Up to 10 most recently played opponents, for quick selection
const recentOpponents = computed<string[]>(() => {
	const collectionName = selectionStore.getSelectedMatchCollectionName
	if (!collectionName) return []

	const currentCollection = matchStore.getMatchCollectionByName(collectionName)
	if (!currentCollection) return []

	const matchesByRecency = getCollectionMatches(currentCollection)
		.slice()
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

	const seen = new Set<string>()
	const result: string[] = []
	for (const match of matchesByRecency) {
		const name = match.opponentName?.trim()
		if (name && !seen.has(name)) {
			seen.add(name)
			result.push(name)
			if (result.length >= 10) break
		}
	}
	return result
})

// Number of round wins required to decide the match (best-of 3|5)
const winsNeeded = computed(() => {
	const collectionName = selectionStore.getSelectedMatchCollectionName
	const currentCollection = collectionName ? matchStore.getMatchCollectionByName(collectionName) : null

	switch (currentCollection?.type) {
		case 'ranked':
		case 'casual':
			return 2 // best of 3
		case 'tournament':
			return 3 // best of 5
		default:
			return Infinity // friendly: no restriction
	}
})

// True once either player has already won, no further round may be added
const isMatchDecided = computed(() => {
	const playerWins = rounds.value.filter(round => round.won === true).length
	const opponentWins = rounds.value.filter(round => round.won === false).length
	return playerWins >= winsNeeded.value || opponentWins >= winsNeeded.value
})

const isFormValid = computed(() => {
	const hasOpponentName = opponentName.value.trim() !== ''
	const allRoundsValid = rounds.value.every(round =>
		round.stage && round.playerRival && round.opponentRival && round.won !== undefined
	)
	return hasOpponentName && allRoundsValid
})

// All rounds in the current collection, used as the source for predicted stage winrates
const currentCollectionRounds = computed<Round[]>(() => {
	const collectionName = selectionStore.getSelectedMatchCollectionName
	if (!collectionName) return []

	const currentCollection = matchStore.getMatchCollectionByName(collectionName)
	if (!currentCollection) return []

	return getCollectionMatches(currentCollection).flatMap(match => match.rounds)
})

/**
 * Computes the predicted per-stage winrate for the matchup pair selected in a round,
 * based on the historical rounds of the current collection.
 */
function getStageWinrates(round: Round): Record<StageName, { timesPlayed: number; percentage: number | undefined }> {
	const result = {} as Record<StageName, { timesPlayed: number; percentage: number | undefined }>

	const player = round.playerRival
	const opponent = round.opponentRival

	for (const stage of STAGES) {
		result[stage.name] = { timesPlayed: 0, percentage: undefined }
	}

	if (!player || !opponent) return result

	const wins = {} as Record<StageName, number>
	for (const stage of STAGES) {
		wins[stage.name] = 0
	}

	for (const r of currentCollectionRounds.value) {
		if (r.playerRival === player && r.opponentRival === opponent) {
			result[r.stage].timesPlayed++
			if (r.won) wins[r.stage]++
		}
	}

	for (const stage of STAGES) {
		const entry = result[stage.name]
		entry.percentage = entry.timesPlayed > 0 ? (wins[stage.name] / entry.timesPlayed) * 100 : undefined
	}

	return result
}

function createEmptyRound(): Round {
	return {
		stage: '' as StageName,
		playerRival: '' as RivalName,
		opponentRival: '' as RivalName,
		won: undefined as unknown as boolean // Force explicit selection
	}
}

function addRound() {
	if (rounds.value.length < maxRoundsAllowed.value && !isMatchDecided.value) {
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

function persistCurrentMatch(): boolean {
	hasAttemptedSave.value = true

	if (!isFormValid.value) {
		alert('Please fill in all required fields.')
		return false
	}

	const collectionName = selectionStore.getSelectedMatchCollectionName
	if (!collectionName) {
		alert('No match collection selected.')
		return false
	}

	const currentCollection = matchStore.getMatchCollectionByName(collectionName)
	if (!currentCollection) {
		alert('Selected match collection not found.')
		return false
	}

	const now = new Date().toISOString()

	// Friendly collections store a flat list of single-round games
	if (isFriendlyCollection(currentCollection)) {
		const round = rounds.value[0]
		const newGame: FriendlyGame = {
			uuid: crypto.randomUUID(),
			createdAt: now,
			updatedAt: now,
			opponentName: opponentName.value.trim(),
			stage: round.stage,
			playerRival: round.playerRival,
			opponentRival: round.opponentRival,
			won: round.won,
			links: links.value.filter(link => link.text.trim() !== '' || link.link.trim() !== ''),
		}

		const updatedCollection: FriendlyMatchCollection = {
			...currentCollection,
			games: [...currentCollection.games, newGame],
			updatedAt: now,
		}

		matchStore.updateMatchCollection(updatedCollection)
		console.log('New friendly game added:', newGame)
		return true
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

	return true
}

function saveMatch() {
	if (!persistCurrentMatch()) return

	// Reset form and clear the persisted draft
	clearDraftAndReset()
	emit('closeAddMatchModal')
}

function rematch() {
	if (!persistCurrentMatch()) return

	// Keep the opponent details, but reset the rounds and links for a new match
	rounds.value = [createEmptyRound()]
	links.value = []
	hasAttemptedSave.value = false
}

function resetForm() {
	playerElo.value = null
	opponentElo.value = null
	opponentName.value = ''
	rounds.value = [createEmptyRound()]
	links.value = []
	hasAttemptedSave.value = false
}

// --- Session storage persistence ---
// While set, changes to the form are not persisted (used during restore/clear).
let isRestoring = false

function persistDraft() {
	if (isRestoring) return
	const draft = {
		playerElo: playerElo.value,
		opponentElo: opponentElo.value,
		opponentName: opponentName.value,
		rounds: rounds.value,
		links: links.value,
	}
	try {
		sessionStorage.setItem(ADD_MATCH_STORAGE_KEY, JSON.stringify(draft))
	} catch (error) {
		console.warn('Failed to persist add-match draft:', error)
	}
}

function loadDraft() {
	let raw: string | null = null
	try {
		raw = sessionStorage.getItem(ADD_MATCH_STORAGE_KEY)
	} catch (error) {
		console.warn('Failed to read add-match draft:', error)
	}
	if (!raw) return

	try {
		const draft = JSON.parse(raw)
		isRestoring = true
		playerElo.value = draft.playerElo ?? null
		opponentElo.value = draft.opponentElo ?? null
		opponentName.value = typeof draft.opponentName === 'string' ? draft.opponentName : ''
		rounds.value = Array.isArray(draft.rounds) && draft.rounds.length > 0 ? draft.rounds : [createEmptyRound()]
		links.value = Array.isArray(draft.links) ? draft.links : []
		nextTick(() => { isRestoring = false })
	} catch (error) {
		console.warn('Failed to restore add-match draft:', error)
		isRestoring = false
	}
}

function clearDraftAndReset() {
	isRestoring = true
	try {
		sessionStorage.removeItem(ADD_MATCH_STORAGE_KEY)
	} catch (error) {
		console.warn('Failed to clear add-match draft:', error)
	}
	resetForm()
	nextTick(() => { isRestoring = false })
}

function handleCancel() {
	clearDraftAndReset()
	emit('closeAddMatchModal')
}

watch(
	[playerElo, opponentElo, opponentName, rounds, links],
	persistDraft,
	{ deep: true }
)

onMounted(loadDraft)
</script>

<style scoped lang="css">
/* Custom modal size for AddMatchModal */
:deep(.modal-container) {
	width: 1000px !important;
	max-width: 95vw !important;
}

.add-match-content {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
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

.recent-opponents {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.4rem;
	margin-top: 0.5rem;
}

.recent-label {
	font-size: 0.8rem;
	color: #94a3b8;
	margin-right: 0.15rem;
}

.opponent-chip {
	padding: 0.25rem 0.6rem;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 999px;
	background-color: rgba(255, 255, 255, 0.06);
	color: #fff;
	font-size: 0.8rem;
	cursor: pointer;
	transition: all 0.2s ease;
}

.opponent-chip:hover {
	border-color: rgba(66, 185, 131, 0.6);
	background-color: rgba(66, 185, 131, 0.12);
}

.opponent-chip.selected {
	border-color: #42b983;
	background-color: rgba(66, 185, 131, 0.25);
	color: #42b983;
	font-weight: bold;
}

.round-item,
.link-item {
	margin-bottom: 0.75rem;
	padding: 0.75rem;
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
	gap: 0.75rem;
}

.round-form-vertical {
	grid-template-columns: 1fr;
	gap: 0.75rem;
}

.character-selection-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.5rem;
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

.disabled-hint {
	font-size: 0.8rem;
	opacity: 0.8;
	margin-left: 0.5rem;
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
