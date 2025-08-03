<template>
	<BaseModal :show="props.display" @close="$emit('closeCSVUploadModal')">
		<template v-slot:header>
			<h3>Upload CSV Matches</h3>
		</template>
		<template v-slot:body>
			<div class="upload-content">
				<!-- Step 1: Collection Type Selection -->
				<div class="collection-type-section">
					<h4>Step 1: Select Collection Type</h4>
					<div class="form-group">
						<label for="collection-type">Type *</label>
						<select
							id="collection-type"
							v-model="matchCollectionType"
							class="form-input"
						>
							<option value="ranked">Ranked</option>
							<option value="casual">Casual</option>
							<option value="friendly">Friendly</option>
							<option value="tournament">Tournament</option>
						</select>
						<p class="info-text">
							<strong>{{ matchCollectionType === 'ranked' ? 'Ranked' :
								matchCollectionType === 'casual' ? 'Casual' :
								matchCollectionType === 'friendly' ? 'Friendly' : 'Tournament' }}:</strong>
							{{ getTypeDescription(matchCollectionType) }}
						</p>
					</div>
				</div>

				<!-- Step 2: File Upload -->
				<div class="upload-section">
					<h4>Step 2: Upload CSV File</h4>
					<p>Upload your match data here.</p>
					<input type="file" accept=".csv" @change="onFileChange" class="file-input" />
				</div>

				<!-- Step 3: Header Mapping -->
				<div v-if="csvHeader.length > 0" class="header-mapping-section">
					<h4>Step 3: Map CSV Headers</h4>
					<div v-if="csvValidationErrors.length > 0" class="validation-errors">
						<h5>❌ CSV Validation Errors:</h5>
						<ul class="error-list">
							<li v-for="error in csvValidationErrors" :key="error" class="error-item">
								{{ error }}
							</li>
						</ul>
					</div>
					<HeaderSelector
						:headers="csvHeader"
						:collection-type="matchCollectionType"
						@mapping-changed="onMappingChanged"
						class="header-selector"
					/>
				</div>

				<!-- Step 4: Collection Configuration -->
				<div v-if="isMappingComplete && csvValidationErrors.length === 0" class="collection-config">
					<h4>Match Collection Configuration</h4>
					<div class="form-group">
						<label for="collection-name">Collection Name *</label>
						<input
							id="collection-name"
							type="text"
							placeholder="Enter collection name"
							v-model="matchCollectionName"
							class="form-input"
							:class="{ 'error': nameError }"
						/>
						<div v-if="nameError" class="error-message">{{ nameError }}</div>
					</div>

					<div class="form-group">
						<label for="collection-description">Description *</label>
						<input
							id="collection-description"
							type="text"
							placeholder="Enter collection description"
							v-model="matchCollectionDescription"
							class="form-input"
						/>
					</div>

					<div class="form-info">
						<p><strong>Selected Type:</strong> {{ matchCollectionType }}</p>
						<p><strong>Collection ID:</strong> {{ nextAvailableId }}</p>
						<p class="info-text">ID will be automatically assigned</p>
					</div>
				</div>
			</div>
		</template>
		<template v-slot:footer>
			<button @click="$emit('closeCSVUploadModal')" class="btn btn-secondary">Close</button>
			<button
				:disabled="!isMatchCollectionComplete"
				@click="buildAndSaveCollection()"
				class="btn btn-primary"
			>
				Save Match Collection
			</button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import HeaderSelector from './HeaderSelector.vue'
import type {
	Match,
	RankedMatch,
	MatchType,
	Round,
	RivalName,
	StageName,
	MatchCollection,
} from '@/types/roa2Types'
import { CSV_MATCH_MAPPING } from '@/constants'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'
import { CURRENT_MATCH_DATA_VERSION } from '@/constants/match'

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

const emit = defineEmits(['closeCSVUploadModal'])

const props = defineProps<{
	display: boolean
}>()

const matchDataMapping = CSV_MATCH_MAPPING

const matchCollectionName = ref<string>('')
const matchCollectionDescription = ref<string>('')
const matchCollectionType = ref<MatchType>('ranked')
const nameError = ref<string>('')

// Compute next available ID
const nextAvailableId = computed(() => {
	const existingNames = matchStore.getMatchCollectionNameList
	if (existingNames.length === 0) return 0

	// Find the smallest available ID starting from 0
	let id = 0
	while (existingNames.includes(`Collection_${id}`)) {
		id++
	}
	return id
})

// Watch for name changes to validate duplicates
watch(matchCollectionName, (newName) => {
	if (newName.trim() === '') {
		nameError.value = ''
		return
	}

	// Check for duplicate names
	const existingCollections = matchStore.matchCollections
	const isDuplicate = existingCollections.some(collection =>
		collection.name.toLowerCase().trim() === newName.toLowerCase().trim()
	)

	if (isDuplicate) {
		nameError.value = 'A collection with this name already exists. Please choose a different name.'
	} else {
		nameError.value = ''
	}
})

// Watch for type changes to re-validate CSV data
watch(matchCollectionType, () => {
	if (csvData.value.length > 0) {
		validateCsvData()
	}
})

const isMatchCollectionComplete = computed(() => {
	return (
		matchCollectionName.value.trim() !== '' &&
		matchCollectionDescription.value.trim() !== '' &&
		['ranked', 'casual', 'friendly', 'tournament'].includes(matchCollectionType.value) &&
		nameError.value === '' &&
		isMappingComplete.value
	)
})

const csvHeader = ref<string[]>([])
const csvData = ref<string[][]>([])
const headerMappings = ref<number[]>([])
const csvValidationErrors = ref<string[]>([])

const isMappingComplete = computed(() => {
	return headerIsValid(headerMappings.value) && csvValidationErrors.value.length === 0
})

function getTypeDescription(type: MatchType): string {
	switch (type) {
		case 'ranked':
			return 'Requires ELO ratings, max 3 rounds per match'
		case 'casual':
			return 'No ELO required, max 3 rounds per match'
		case 'tournament':
			return 'No ELO required, max 5 rounds per match'
		case 'friendly':
			return 'No ELO required, up to 10 rounds per match'
		default:
			return ''
	}
}

function headerIsValid(mappings: number[]): boolean {
	if (mappings.length !== Object.keys(matchDataMapping).length) return false
	const uniqueMappings = new Set()
	const maxIndex = csvHeader.value.length - 1

	// Required fields for all collection types
	const requiredFields = ['id', 'opponentName', 'stage', 'playerRival', 'opponentRival', 'won']
	// ELO fields are only required for ranked collections
	if (matchCollectionType.value === 'ranked') {
		requiredFields.push('playerElo', 'opponentElo')
	}

	for (let i = 0; i < mappings.length; i++) {
		const fieldName = Object.keys(matchDataMapping)[i]
		const mappingValue = mappings[i]

		// Check if this field is required
		const isRequired = requiredFields.includes(fieldName)

		if (mappingValue < 0 && isRequired) {
			return false // required mappings must be set
		}
		if (mappingValue >= 0) {
			if (mappingValue > maxIndex) {
				return false // mapping index must be within the range of available headers
			}
			if (uniqueMappings.has(mappingValue)) {
				return false // no duplicate mappings allowed
			}
			uniqueMappings.add(mappingValue)
		}
	}
	return true
}

function onFileChange(event: Event) {
	const input = event.target as HTMLInputElement
	if (input.files && input.files.length > 0) {
		const file = input.files[0]
		console.log('Selected file:', file.name)
		console.log(file)
		console.log('File type:', file.type)
		const reader = new FileReader()
		reader.onload = (e) => {
			const content = e.target?.result
			if (typeof content === 'string') {
				// process file content into a 2D array by columns
				const rows = content.split('\n').map((row) => row.split(','))
				csvHeader.value = rows[0] // assuming the first row is the header
				csvData.value = rows.slice(1) // the rest are data rows

				// Clear previous validation errors
				csvValidationErrors.value = []

				// Validate CSV data based on selected type
				validateCsvData()
			} else {
				console.error('File content is not a string')
			}
		}
		reader.onerror = (e) => {
			console.error('Error reading file:', e)
		}
		reader.readAsText(file)
	}
}

function validateCsvData() {
	csvValidationErrors.value = []

	if (csvData.value.length === 0) return

	// Get round limits based on type
	const maxRounds = getMaxRoundsForType(matchCollectionType.value)

	// Group rounds by match ID and validate
	const matchRoundCounts = new Map<number, number>()

	for (let i = 0; i < csvData.value.length; i++) {
		const row = csvData.value[i]
		const lineNumber = i + 2 // +2 because array is 0-indexed and we skipped header

		// Skip empty rows
		if (row.every(cell => !cell.trim())) continue

		try {
			// Try to parse match ID from first column (assuming ID is first)
			const matchId = parseInt(row[0])
			if (isNaN(matchId)) {
				csvValidationErrors.value.push(`Line ${lineNumber}: Invalid match ID "${row[0]}"`)
				continue
			}

			// Count rounds per match
			matchRoundCounts.set(matchId, (matchRoundCounts.get(matchId) || 0) + 1)

			// Check if this match exceeds round limit
			const currentRoundCount = matchRoundCounts.get(matchId) || 0
			if (currentRoundCount > maxRounds) {
				csvValidationErrors.value.push(
					`Line ${lineNumber}: Round is connected to a full match (${matchCollectionType.value} allows only ${maxRounds} rounds per match)`
				)
			}

		} catch (error) {
			console.error('Error parsing row:', error)
			csvValidationErrors.value.push(`Line ${lineNumber}: Error parsing row data`)
		}
	}
}

function getMaxRoundsForType(type: MatchType): number {
	switch (type) {
		case 'ranked':
		case 'casual':
			return 3
		case 'tournament':
			return 5
		case 'friendly':
			return 10
		default:
			return 3
	}
}

function onMappingChanged(mappings: number[]) {
	headerMappings.value = mappings
	console.log('Header mappings:', mappings)
}

function isWin(value: string): boolean {
	return value.toLowerCase() == 'win' || value.toLowerCase() === 'true' || value === '1'
}

function buildAndSaveCollection() {
	// Final validation before saving
	if (nameError.value) {
		alert('Please fix the name error before saving.')
		return
	}

	const matchCollection: MatchCollection | void = buildCollection()
	if (!matchCollection) {
		console.error('Failed to build match collection')
		return
	}

	// Add the collection to the store
	matchStore.addMatchCollection(matchCollection)
	console.log('Match collection saved.')

	// Automatically select the new match collection
	selectionStore.setMatchCollectionName(matchCollection.name)
	console.log('New match collection automatically selected:', matchCollection.name)

	// Reset form after successful save
	resetForm()
	emit('closeCSVUploadModal')
}

function resetForm() {
	matchCollectionName.value = ''
	matchCollectionDescription.value = ''
	matchCollectionType.value = 'ranked'
	nameError.value = ''
	csvHeader.value = []
	csvData.value = []
	headerMappings.value = []
	csvValidationErrors.value = []
}

function buildCollection(): MatchCollection | void {
	if (!isMappingComplete.value) {
		console.error('Header mapping is not complete or valid')
		return
	}

	const rows = csvData.value
	const isRanked = matchCollectionType.value === 'ranked'

	const matches: (Match | RankedMatch)[] = []
	let index = -1
	let lastId = ""

	let match: Match | RankedMatch | null = null
	while (++index < csvData.value.length) {
		const stage: StageName = rows[index][headerMappings.value[matchDataMapping.stage]] as StageName
		const playerRival: RivalName = rows[index][
			headerMappings.value[matchDataMapping.playerRival]
		] as RivalName
		const opponentRival: RivalName = rows[index][
			headerMappings.value[matchDataMapping.opponentRival]
		] as RivalName
		const won: boolean = isWin(rows[index][headerMappings.value[matchDataMapping.won]])
		const round: Round = {
			stage: stage,
			playerRival: playerRival,
			opponentRival: opponentRival,
			won: won,
		}

		const id: string = rows[index][headerMappings.value[matchDataMapping.id]]

		if (id !== lastId) {
			if (match !== null) {
				matches.push(match)
			}
			lastId = id
			const opponentName: string = rows[index][headerMappings.value[matchDataMapping.opponentName]]
			const links: { text: string; link: string }[] = rows[index][
				headerMappings.value[matchDataMapping.links]
			]
				? JSON.parse(rows[index][headerMappings.value[matchDataMapping.links]])
				: []

			// Create appropriate match type based on collection type
			if (isRanked) {
				const playerEloRaw: number = parseInt(rows[index][headerMappings.value[matchDataMapping.playerElo]])
				const opponentEloRaw: number = parseInt(rows[index][headerMappings.value[matchDataMapping.opponentElo]])

				const playerElo: number = isNaN(playerEloRaw) || playerEloRaw < 0 ? -1 : playerEloRaw
				const opponentElo: number = isNaN(opponentEloRaw) || opponentEloRaw < 0 ? -1 : opponentEloRaw

				match = {
					uuid: crypto.randomUUID(),
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					playerElo: playerElo,
					opponentElo: opponentElo,
					opponentName: opponentName,
					rounds: [],
					links: links,
				} as RankedMatch
			} else {
				match = {
					uuid: crypto.randomUUID(),
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					opponentName: opponentName,
					rounds: [],
					links: links,
				} as Match
			}
		}
		if (match) {
			match.rounds.push(round)
		} else {
			console.error('Match is null, cannot add round:', rows[index])
		}
	}
	if (match !== null) {
		matches.push(match)
	}

	const date = new Date().toISOString()

	const matchCollection = {
		uuid: crypto.randomUUID(),
		version: CURRENT_MATCH_DATA_VERSION,
		createdAt: date,
		updatedAt: date,
		name: matchCollectionName.value,
		type: matchCollectionType.value,
		description: matchCollectionDescription.value,
		matches: matches,
	}

	console.log('Building match collection:', matchCollection)
	return matchCollection
}
</script>

<style scoped lang="css">
/* Custom modal size for CSVUploadModal */
:deep(.modal-container) {
	width: 800px !important;
	max-width: 90vw !important;
}

.upload-content {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.collection-type-section,
.upload-section,
.header-selector,
.collection-config {
	padding: 1rem;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 8px;
	background-color: rgba(255, 255, 255, 0.1);
}

.collection-type-section {
	border-left: 4px solid #42b983;
}

.collection-type-section h4,
.upload-section h4,
.header-mapping-section h4,
.collection-config h4 {
	margin: 0 0 1rem 0;
	color: #42b983;
	font-size: 1.1rem;
}

.file-input {
	width: 100%;
	padding: 0.5rem;
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 4px;
	margin-top: 0.5rem;
	background-color: rgba(255, 255, 255, 0.1);
	color: #e2e8f0;
}

.header-mapping-section {
	display: block;
}

.validation-errors {
	background-color: rgba(231, 76, 60, 0.1);
	border: 1px solid rgba(231, 76, 60, 0.3);
	border-radius: 4px;
	padding: 1rem;
	margin-bottom: 1rem;
}

.validation-errors h5 {
	margin: 0 0 0.5rem 0;
	color: #e74c3c;
	font-size: 1rem;
}

.error-list {
	margin: 0;
	padding-left: 1.5rem;
	list-style-type: disc;
}

.error-item {
	color: #e74c3c;
	margin-bottom: 0.25rem;
	font-size: 0.9rem;
}

.form-info {
	background-color: rgba(52, 152, 219, 0.1);
	border: 1px solid rgba(52, 152, 219, 0.3);
	padding: 1rem;
	border-radius: 4px;
	border-left: 4px solid #3498db;
	margin-bottom: 0;
}

.form-info p {
	margin: 0 0 0.5rem 0;
	color: #e2e8f0;
}

.form-info p:last-child {
	margin-bottom: 0;
}

.info-text {
	font-size: 0.9rem;
	color: #94a3b8;
	font-style: italic;
}

/* Ensure HeaderSelector is visible and properly styled */
:deep(.header-selector) {
	display: block !important;
	visibility: visible !important;
}

:deep(.mapping-grid) {
	display: grid !important;
	gap: 0.5rem !important;
}

:deep(.mapping-row) {
	display: flex !important;
	align-items: center !important;
	gap: 0.5rem !important;
}

:deep(.property-label) {
	min-width: 120px !important;
	font-weight: 500 !important;
	color: #e2e8f0 !important;
}

:deep(.header-select) {
	flex: 1 !important;
	padding: 0.5rem !important;
	border: 1px solid rgba(255, 255, 255, 0.3) !important;
	border-radius: 4px !important;
	background-color: rgba(255, 255, 255, 0.1) !important;
	color: #e2e8f0 !important;
}
</style>
