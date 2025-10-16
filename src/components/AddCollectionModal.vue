<template>
	<BaseModal :show="display" @close="$emit('closeAddCollectionModal')">
		<template v-slot:header>
			<h3>Create New Match Collection</h3>
		</template>
		<template v-slot:body>
			<div class="form-container">
				<div class="form-group">
					<label for="collection-name">Name *</label>
					<input
						id="collection-name"
						type="text"
						placeholder="Enter collection name"
						v-model="collectionName"
						class="form-input"
						:class="{ 'error': nameError }"
					/>
					<div v-if="nameError" class="error-message">{{ nameError }}</div>
				</div>

				<div class="form-group">
					<label for="collection-description">Description *</label>
					<textarea
						id="collection-description"
						placeholder="Enter collection description"
						v-model="collectionDescription"
						class="form-input textarea"
						rows="3"
					></textarea>
				</div>

				<div class="form-group">
					<label for="collection-type">Type *</label>
					<select
						id="collection-type"
						v-model="collectionType"
						class="form-input"
					>
						<option value="ranked">Ranked</option>
						<option value="casual">Casual</option>
						<option value="friendly">Friendly</option>
						<option value="tournament">Tournament</option>
					</select>
				</div>

				<div class="form-info">
					<p class="info-text">Collection will be identified by name</p>
				</div>
			</div>
		</template>
		<template v-slot:footer>
			<button @click="$emit('closeAddCollectionModal')" class="btn btn-secondary">Cancel</button>
			<button
				:disabled="!isFormComplete"
				@click="createCollection"
				class="btn btn-primary"
			>
				Create Collection
			</button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import type { AnyMatchCollection, MatchType } from '@/types/roa2Types'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'
import { CURRENT_MATCH_DATA_VERSION } from '@/constants'

const props = defineProps<{
	display: boolean
}>()

const emit = defineEmits<{
	closeAddCollectionModal: []
}>()

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

const collectionName = ref('')
const collectionDescription = ref('')
const collectionType = ref<MatchType>('ranked')
const nameError = ref('')

// Watch for name changes to validate uniqueness
watch(collectionName, (newName) => {
	if (newName.trim() === '') {
		nameError.value = ''
		return
	}

	const existingNames = matchStore.matchCollections.map(c => c.name.toLowerCase())
	if (existingNames.includes(newName.toLowerCase())) {
		nameError.value = 'A collection with this name already exists. Please choose a different name.'
	} else {
		nameError.value = ''
	}
})

const isFormComplete = computed(() => {
	return (
		collectionName.value.trim() !== '' &&
		collectionDescription.value.trim() !== '' &&
		['ranked', 'casual', 'friendly', 'tournament'].includes(collectionType.value) &&
		nameError.value === ''
	)
})

function createCollection() {
	if (!isFormComplete.value) {
		return
	}

	const date = new Date().toISOString()

	const newCollection: AnyMatchCollection = {
		version: CURRENT_MATCH_DATA_VERSION,
		uuid: crypto.randomUUID(),
		createdAt: date,
		updatedAt: date,
		name: collectionName.value.trim(),
		type: collectionType.value,
		description: collectionDescription.value.trim(),
		readOnly: false,
		matches: []
	}

	// Add the collection to the store
	matchStore.addMatchCollection(newCollection)
	console.log('Match collection created:', newCollection)

	// Automatically select the new match collection
	selectionStore.setMatchCollectionName(newCollection.name)
	console.log('New match collection automatically selected:', newCollection.name)

	// Reset form and close modal
	resetForm()
	emit('closeAddCollectionModal')
}

function resetForm() {
	collectionName.value = ''
	collectionDescription.value = ''
	collectionType.value = 'ranked'
	nameError.value = ''
}

// Reset form when modal is opened
watch(() => props.display, (newDisplay) => {
	if (newDisplay) {
		resetForm()
	}
})
</script>

<style scoped lang="css">
.form-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	max-width: 500px;
}

.form-info {
	background-color: rgba(66, 185, 131, 0.1);
	border: 1px solid rgba(66, 185, 131, 0.3);
	padding: 1rem;
	border-radius: 6px;
	border-left: 4px solid #42b983;
}

.form-info p {
	margin: 0;
	font-size: 0.9rem;
	color: #e2e8f0;
}

.info-text {
	color: #94a3b8;
	font-style: italic;
}
</style>
