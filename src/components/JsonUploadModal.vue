<template>
	<BaseModal :show="props.display" @close="$emit('closeJsonUploadModal')">
		<template v-slot:header>
			<h3>Upload Match Collection JSON</h3>
		</template>
		<template v-slot:body>
			<div class="upload-content">
				<!-- File Upload Section -->
				<div class="upload-section">
					<h4>Select JSON File</h4>
					<p>Upload a previously exported match collection JSON file.</p>
					<input type="file" accept=".json" @change="onFileChange" class="file-input" />
				</div>

				<!-- JSON Preview -->
				<div v-if="jsonData" class="preview-section">
					<h4>Collection Preview</h4>
					<div class="collection-info">
						<p><strong>Name:</strong> {{ jsonData.name }}</p>
						<p><strong>Type:</strong> {{ jsonData.type }}</p>
						<p><strong>Description:</strong> {{ jsonData.description }}</p>
						<p><strong>Matches:</strong> {{ jsonData.matches?.length || 0 }}</p>
						<p><strong>Created:</strong> {{ formatDate(jsonData.createdAt) }}</p>
						<p><strong>Updated:</strong> {{ formatDate(jsonData.updatedAt) }}</p>
					</div>
				</div>

				<!-- Conflict Resolution -->
				<div v-if="conflictInfo" class="conflict-section">
					<h4>⚠️ Conflict Detected</h4>
					<div class="conflict-details">
						<p v-if="conflictInfo.nameExists">
							<strong>Name Conflict:</strong> A collection named "{{ jsonData?.name }}" already exists.
						</p>
						<p v-if="conflictInfo.matchIdConflicts && conflictInfo.matchIdConflicts.length > 0">
							<strong>Match Content Conflicts:</strong> {{ conflictInfo.matchIdConflicts.length }} matches have same IDs but different content: {{ conflictInfo.matchIdConflicts.join(', ') }}
							<br><small>💡 Identical matches with same IDs are fine and will be merged automatically.</small>
						</p>
					</div>

					<div class="resolution-options">
						<h5>How would you like to resolve this?</h5>
						<div class="radio-group">
							<label class="radio-option">
								<input type="radio" v-model="resolutionStrategy" value="replace" />
								<strong>Replace</strong> - Overwrite the existing collection completely
							</label>
							<label class="radio-option" :class="{ disabled: !conflictInfo.canMerge }">
								<input
									type="radio"
									v-model="resolutionStrategy"
									value="merge"
									:disabled="!conflictInfo.canMerge"
								/>
								<div>
									<strong>Merge</strong> - Add matches to existing collection (original match IDs preserved)
									<div v-if="!conflictInfo.canMerge" class="disabled-reason">
										❌ Cannot merge: Some matches have same IDs but different content. Identical matches are OK, but conflicting content prevents safe merging.
									</div>
								</div>
							</label>
							<label class="radio-option">
								<input type="radio" v-model="resolutionStrategy" value="newName" />
								<strong>Import as New</strong> - Create new collection with modified name (match IDs preserved)
							</label>
							<label class="radio-option">
								<input type="radio" v-model="resolutionStrategy" value="cancel" />
								<strong>Cancel</strong> - Don't import this collection
							</label>
						</div>
					</div>
				</div>

				<!-- Validation Errors -->
				<div v-if="validationErrors.length > 0" class="validation-errors">
					<h4>❌ Validation Errors</h4>
					<ul class="error-list">
						<li v-for="error in validationErrors" :key="error" class="error-item">
							{{ error }}
						</li>
					</ul>
				</div>
			</div>
		</template>
		<template v-slot:footer>
			<button @click="$emit('closeJsonUploadModal')" class="btn btn-secondary">Cancel</button>
			<button
				:disabled="!canImport"
				@click="importCollection"
				class="btn btn-primary"
			>
				{{ conflictInfo ? 'Resolve & Import' : 'Import Collection' }}
			</button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import type { AnyMatchCollection } from '@/types/roa2Types'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

const emit = defineEmits(['closeJsonUploadModal'])

const props = defineProps<{
	display: boolean
}>()

const jsonData = ref<AnyMatchCollection | null>(null)
const validationErrors = ref<string[]>([])
const resolutionStrategy = ref<'replace' | 'merge' | 'newName' | 'cancel'>('cancel')

// Helper function to compare matches for equality (excluding timestamps)
function areMatchesEqual(match1: AnyMatchCollection['matches'][0], match2: AnyMatchCollection['matches'][0]): boolean {
	// Compare all relevant properties except any that might differ but are acceptable
	const props1 = {
		id: match1.id,
		opponentName: match1.opponentName,
		opponentElo: 'opponentElo' in match1 ? match1.opponentElo : undefined,
		playerElo: 'playerElo' in match1 ? match1.playerElo : undefined,
		rounds: match1.rounds,
		links: match1.links
	}

	const props2 = {
		id: match2.id,
		opponentName: match2.opponentName,
		opponentElo: 'opponentElo' in match2 ? match2.opponentElo : undefined,
		playerElo: 'playerElo' in match2 ? match2.playerElo : undefined,
		rounds: match2.rounds,
		links: match2.links
	}

	return JSON.stringify(props1) === JSON.stringify(props2)
}

// Conflict detection
const conflictInfo = computed(() => {
	if (!jsonData.value) return null

	const existingCollections = matchStore.matchCollections
	const nameExists = existingCollections.some(c =>
		c.name.toLowerCase().trim() === jsonData.value!.name.toLowerCase().trim()
	)

	const matchIdConflicts: number[] = []

	// Check for match ID conflicts if we want to merge
	if (nameExists) {
		const targetCollection = existingCollections.find(c =>
			c.name.toLowerCase().trim() === jsonData.value!.name.toLowerCase().trim()
		)

		if (targetCollection) {
			// Create a map of existing matches by ID for quick lookup
			const existingMatchesById = new Map(targetCollection.matches.map(m => [m.id, m]))

			// Check each new match for conflicts
			for (const newMatch of jsonData.value!.matches) {
				const existingMatch = existingMatchesById.get(newMatch.id)
				if (existingMatch) {
					// Match ID exists, check if they are identical
					if (!areMatchesEqual(newMatch, existingMatch)) {
						// Same ID but different content - this is a real conflict
						matchIdConflicts.push(newMatch.id)
					}
					// If they are identical, no conflict (this is okay)
				}
			}
		}
	}

	if (nameExists || matchIdConflicts.length > 0) {
		return {
			nameExists,
			matchIdConflicts,
			canMerge: matchIdConflicts.length === 0
		}
	}

	return null
})

const canImport = computed(() => {
	return jsonData.value &&
		   validationErrors.value.length === 0 &&
		   (!conflictInfo.value || resolutionStrategy.value !== 'cancel')
})

// Watch for conflict changes and adjust resolution strategy if needed
watch(conflictInfo, (newConflictInfo) => {
	if (newConflictInfo && !newConflictInfo.canMerge && resolutionStrategy.value === 'merge') {
		resolutionStrategy.value = 'cancel'
	}
})

function onFileChange(event: Event) {
	const input = event.target as HTMLInputElement
	if (input.files && input.files.length > 0) {
		const file = input.files[0]
		const reader = new FileReader()

		reader.onload = (e) => {
			const content = e.target?.result
			if (typeof content === 'string') {
				try {
					const data = JSON.parse(content)
					validateJsonData(data)
				} catch {
					validationErrors.value = ['Invalid JSON file format']
					jsonData.value = null
				}
			}
		}

		reader.onerror = () => {
			validationErrors.value = ['Error reading file']
			jsonData.value = null
		}

		reader.readAsText(file)
	}
}

function validateJsonData(data: unknown) {
	validationErrors.value = []

	// Type guard to check if data is an object
	if (!data || typeof data !== 'object') {
		validationErrors.value.push('Invalid JSON structure')
		jsonData.value = null
		return
	}

	const obj = data as Record<string, unknown>

	// Check required fields
	if (!obj.name || typeof obj.name !== 'string') {
		validationErrors.value.push('Missing required field: name')
	}
	if (!obj.type || typeof obj.type !== 'string') {
		validationErrors.value.push('Missing required field: type')
	}
	if (!obj.description || typeof obj.description !== 'string') {
		validationErrors.value.push('Missing required field: description')
	}
	if (!obj.createdAt || typeof obj.createdAt !== 'string') {
		validationErrors.value.push('Missing required field: createdAt')
	}
	if (!obj.updatedAt || typeof obj.updatedAt !== 'string') {
		validationErrors.value.push('Missing required field: updatedAt')
	}
	if (!Array.isArray(obj.matches)) {
		validationErrors.value.push('Invalid matches format (must be array)')
	}

	// Validate type
	if (obj.type && !['ranked', 'casual', 'friendly', 'tournament'].includes(obj.type as string)) {
		validationErrors.value.push(`Invalid collection type: ${obj.type}`)
	}

	// Validate matches structure
	if (Array.isArray(obj.matches)) {
		obj.matches.forEach((match: unknown, index: number) => {
			if (!match || typeof match !== 'object') {
				validationErrors.value.push(`Match ${index + 1}: Invalid match structure`)
				return
			}

			const matchObj = match as Record<string, unknown>

			if (!matchObj.id && matchObj.id !== 0) {
				validationErrors.value.push(`Match ${index + 1}: Missing id`)
			}
			if (!matchObj.opponentName || typeof matchObj.opponentName !== 'string') {
				validationErrors.value.push(`Match ${index + 1}: Missing opponentName`)
			}
			if (!Array.isArray(matchObj.rounds)) {
				validationErrors.value.push(`Match ${index + 1}: Invalid rounds format`)
			}
			if (obj.type === 'ranked') {
				if (typeof matchObj.playerElo !== 'number') {
					validationErrors.value.push(`Match ${index + 1}: Missing or invalid playerElo for ranked collection`)
				}
				if (typeof matchObj.opponentElo !== 'number') {
					validationErrors.value.push(`Match ${index + 1}: Missing or invalid opponentElo for ranked collection`)
				}
			}
		})
	}

	if (validationErrors.value.length === 0) {
		jsonData.value = obj as unknown as AnyMatchCollection
		// Set initial resolution strategy based on conflicts
		const conflict = conflictInfo.value
		if (conflict) {
			// If there are match ID conflicts, don't allow merge as default
			if (!conflict.canMerge && resolutionStrategy.value === 'merge') {
				resolutionStrategy.value = 'cancel'
			} else if (resolutionStrategy.value === 'cancel') {
				// Only set to cancel initially, let user choose
				resolutionStrategy.value = 'cancel'
			}
		} else {
			resolutionStrategy.value = 'newName'
		}
	} else {
		jsonData.value = null
	}
}

function importCollection() {
	if (!jsonData.value || !canImport.value) return

	const collection = { ...jsonData.value }

	switch (resolutionStrategy.value) {
		case 'replace':
			// Find and replace existing collection by name
			const existingCollection = matchStore.getMatchCollectionByName(collection.name)
			if (existingCollection) {
				collection.updatedAt = new Date().toISOString()
				matchStore.updateMatchCollection(collection)
			} else {
				// No existing collection found, add as new
				matchStore.addMatchCollection(collection)
			}
			break

		case 'merge':
			// Merge matches into existing collection (preserving original match IDs)
			const targetCollection = matchStore.getMatchCollectionByName(collection.name)
			if (targetCollection) {
				// Create a map of existing matches by ID for intelligent merging
				const existingMatchesById = new Map(targetCollection.matches.map(m => [m.id, m]))
				const matchesToAdd = []

				// Check each new match
				for (const newMatch of collection.matches) {
					const existingMatch = existingMatchesById.get(newMatch.id)
					if (existingMatch) {
						// Match ID exists, check if they are identical
						if (!areMatchesEqual(newMatch, existingMatch)) {
							// This should not happen if conflict detection worked correctly
							alert(`Cannot merge: Match ID ${newMatch.id} has conflicting content. This should not happen.`)
							return
						}
						// If identical, skip adding (avoid duplicates)
					} else {
						// New match, add it
						matchesToAdd.push(newMatch)
					}
				}

				// Add only the new matches
				const updatedCollection = {
					...targetCollection,
					matches: [...targetCollection.matches, ...matchesToAdd],
					updatedAt: new Date().toISOString()
				}
				matchStore.updateMatchCollection(updatedCollection)
			}
			break

		case 'newName':
			// Import as new collection with modified name to avoid conflicts
			// NEVER change match IDs - they are sacred identifiers!
			let newName = collection.name
			let counter = 1
			while (matchStore.getMatchCollectionByName(newName)) {
				newName = `${collection.name} (${counter})`
				counter++
			}
			collection.name = newName
			collection.updatedAt = new Date().toISOString()

			// Keep original match IDs - they must never be changed!
			matchStore.addMatchCollection(collection)
			break

		case 'cancel':
		default:
			return
	}

	// Select the imported/updated collection
	selectionStore.setMatchCollectionName(collection.name)

	// Reset and close
	resetForm()
	emit('closeJsonUploadModal')
}

function resetForm() {
	jsonData.value = null
	validationErrors.value = []
	resolutionStrategy.value = 'cancel'
}

function formatDate(dateString: string): string {
	if (!dateString) return 'Unknown'
	return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped lang="css">
/* Custom modal size for JsonUploadModal */
:deep(.modal-container) {
	width: 700px !important;
	max-width: 90vw !important;
}

.upload-content {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.upload-section {
	padding: 1rem;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 8px;
	background-color: rgba(255, 255, 255, 0.1);
}

.upload-section h4 {
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

.preview-section {
	padding: 1rem;
	border: 1px solid rgba(66, 185, 131, 0.3);
	border-radius: 8px;
	background-color: rgba(66, 185, 131, 0.1);
	border-left: 4px solid #42b983;
}

.preview-section h4 {
	margin: 0 0 1rem 0;
	color: #42b983;
	font-size: 1.1rem;
}

.collection-info p {
	margin: 0.25rem 0;
	color: #e2e8f0;
}

.conflict-section {
	padding: 1rem;
	border: 1px solid rgba(243, 156, 18, 0.3);
	border-radius: 8px;
	background-color: rgba(243, 156, 18, 0.1);
	border-left: 4px solid #f39c12;
}

.conflict-section h4 {
	margin: 0 0 1rem 0;
	color: #f39c12;
	font-size: 1.1rem;
}

.conflict-details p {
	margin: 0.5rem 0;
	color: #f39c12;
	font-weight: 500;
}

.resolution-options {
	margin-top: 1rem;
}

.resolution-options h5 {
	margin: 0 0 0.75rem 0;
	color: #e2e8f0;
	font-size: 1rem;
}

.radio-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.radio-option {
	display: flex;
	align-items: flex-start;
	gap: 0.5rem;
	padding: 0.5rem;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.2s;
	color: #e2e8f0;
}

.radio-option:hover {
	background-color: rgba(255, 255, 255, 0.1);
}

.radio-option.disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.radio-option.disabled:hover {
	background-color: transparent;
}

.disabled-reason {
	font-size: 0.8rem;
	color: #ff6b81;
	margin-top: 0.25rem;
	font-style: italic;
}

.radio-option input[type="radio"] {
	margin-top: 0.1rem;
}

.validation-errors {
	background-color: rgba(231, 76, 60, 0.1);
	border: 1px solid rgba(231, 76, 60, 0.3);
	border-radius: 4px;
	padding: 1rem;
}

.validation-errors h4 {
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
</style>
