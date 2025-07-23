<template>
	<div class="header-selector">
		<h4>Map CSV Headers to Match Properties</h4>
		<div class="mapping-grid">
			<div v-for="(property, index) in matchProperties" :key="property" class="mapping-row">
				<label :for="`select-${property}`" class="property-label"> {{ property }}: </label>
				<select
					:id="`select-${property}`"
					v-model="selectedMappings[index]"
					@change="emitMappings"
					class="header-select"
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

const props = defineProps<{
	headers: string[]
}>()

const emit = defineEmits<{
	mappingChanged: [mappings: number[]]
}>()

// Match properties that need to be mapped
const matchProperties = [
	'id',
	'playerElo',
	'opponentElo',
	'opponentName',
	'stage',
	'playerRival',
	'opponentRival',
	'won',
	'links',
] as const

// Array to store the selected header indices for each match property
const selectedMappings = ref<(number | string)[]>(new Array(matchProperties.length).fill(''))

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
</style>
