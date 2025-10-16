<template>
	<BaseModal :show="display" @close="handleClose">
		<template #header>
			<h3>Edit Match Collection</h3>
		</template>

		<template #body>
			<div class="form-container">
				<div class="form-group">
					<label for="edit-collection-name">Name *</label>
					<input
						id="edit-collection-name"
						type="text"
						class="form-input"
						:class="{ error: nameError !== '' }"
						placeholder="Enter collection name"
						v-model="name"
					/>
					<div v-if="nameError" class="error-message">{{ nameError }}</div>
				</div>

				<div class="form-group">
					<label for="edit-collection-description">Description</label>
					<textarea
						id="edit-collection-description"
						class="form-input textarea"
						rows="3"
						placeholder="Enter collection description"
						v-model="description"
					></textarea>
				</div>
			</div>
		</template>

		<template #footer>
			<button class="btn btn-secondary" @click="handleClose">Cancel</button>
			<button class="btn btn-primary" :disabled="!isFormValid" @click="handleSubmit">Save Changes</button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import type { AnyMatchCollection } from '@/types/roa2Types'

const props = defineProps<{
	display: boolean
	collection: AnyMatchCollection | null
	existingNames: string[]
}>()

const emit = defineEmits<{
	close: []
	save: [{ name: string; description: string }]
}>()

const name = ref('')
const description = ref('')
const nameError = ref('')

const normalizedExistingNames = computed(() => props.existingNames.map((entry) => entry.toLowerCase()))

watch(() => props.display, (isVisible) => {
	if (isVisible) {
		initializeForm()
	} else {
		resetForm()
	}
})

watch(() => props.collection, (newCollection, previousCollection) => {
	if (props.display && newCollection !== previousCollection) {
		initializeForm()
	}
})

watch(name, (newName) => {
	if (!props.collection) {
		nameError.value = ''
		return
	}

	const trimmed = newName.trim()

	if (!trimmed) {
		nameError.value = 'Name is required.'
		return
	}

	const lower = trimmed.toLowerCase()
	const currentLower = props.collection.name.toLowerCase()

	if (lower !== currentLower && normalizedExistingNames.value.includes(lower)) {
		nameError.value = 'A collection with this name already exists.'
	} else {
		nameError.value = ''
	}
})

const isFormValid = computed(() => {
	return props.collection !== null && name.value.trim().length > 0 && nameError.value === ''
})

function initializeForm() {
	if (!props.collection) {
		resetForm()
		return
	}

	name.value = props.collection.name
	description.value = props.collection.description ?? ''
	nameError.value = ''
}

function resetForm() {
	name.value = ''
	description.value = ''
	nameError.value = ''
}

function handleSubmit() {
	if (!isFormValid.value) {
		return
	}

	emit('save', {
		name: name.value.trim(),
		description: description.value.trim(),
	})
}

function handleClose() {
	emit('close')
}
</script>

<style scoped>
/* Additional modal-specific tweaks can go here if needed */
</style>
