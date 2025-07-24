<template>
	<div class="header-selector">
		<h4>Map CSV Headers to Match Properties</h4>
		<div class="mapping-grid">
			<div v-for="(property, index) in matchProperties" :key="property" class="mapping-row">
				<label :for="`select-${property}`" class="property-label">
					{{ property }}{{ isPropertyRequired(property) ? ' *' : ' (optional)' }}:
				</label>
				<select
					:id="`select-${property}`"
					v-model="selectedMappings[index]"
					@change="emitMappings"
					class="header-select"
					:class="{ 'optional-field': !isPropertyRequired(property) }"
				>
					<option value="">-- Select Header --</option>
					<option v-for="(header, headerIndex) in headers" :key="headerIndex" :value="headerIndex">
						{{ header }} (Column {{ headerIndex + 1 }})
					</option>
				</select>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { MATCH_PROPERTIES } from '@/constants'
import type { MatchType } from '@/types/roa2Types'

const props = defineProps<{
	headers: string[]
	collectionType?: MatchType
}>()

const emit = defineEmits<{
	mappingChanged: [mappings: number[]]
}>()

// Match properties that need to be mapped
const matchProperties = MATCH_PROPERTIES

// Array to store the selected header indices for each match property
const selectedMappings = ref<(number | string)[]>(new Array(matchProperties.length).fill(''))

// Determine if a property is required based on collection type
function isPropertyRequired(property: string): boolean {
	const requiredFields = ['id', 'opponentName', 'stage', 'playerRival', 'opponentRival', 'won']
	// ELO fields are only required for ranked collections
	if (props.collectionType === 'ranked') {
		requiredFields.push('playerElo', 'opponentElo')
	}
	return requiredFields.includes(property)
}

function emitMappings() {
	// Convert to numbers and filter out empty selections
	const mappings = selectedMappings.value.map((val) => (val === '' ? -1 : Number(val)))
	emit('mappingChanged', mappings)
}

// Watch for changes in headers prop to reset mappings
watch(
	() => props.headers,
	() => {
		selectedMappings.value = new Array(matchProperties.length).fill('')
	},
)
</script>

<style scoped>
.header-selector {
	padding: 1rem;
	border: 1px solid #ddd;
	border-radius: 8px;
	margin: 1rem 0;
}

.mapping-grid {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.mapping-row {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.property-label {
	min-width: 120px;
	font-weight: 500;
}

.header-select {
	flex: 1;
	padding: 0.25rem;
	border: 1px solid #ccc;
	border-radius: 4px;
}

.optional-field {
	opacity: 0.7;
	border-style: dashed;
}

.property-label {
	font-size: 0.9rem;
}
</style>
