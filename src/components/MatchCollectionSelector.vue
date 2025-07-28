<template>
	<select v-model="selectedName" @change="(Event) => updateSelection(Event)">
		<option v-if="!matchCollections.length" disabled value="">no match collection</option>
		<option v-for="collection in matchCollections" :key="collection.name" :value="collection.name">
			{{ collection.name }}
		</option>
	</select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

const matchCollections = computed(() => matchStore.matchCollections)
const selectedName = computed({
	get: () => selectionStore.getSelectedMatchCollectionName,
	set: (val: string) => selectionStore.setMatchCollectionName(val),
})

function updateSelection(event: Event) {
	const newName = (event.target as HTMLSelectElement).value
	selectedName.value = newName
}
</script>

<style scoped lang="css">
select {
	width: 300px;
	padding: 0.5em;
	font-size: 1em;
	background-color: rgba(0, 0, 0, 0.8);
	color: #42b983;
	border: 1px solid #42b983;
	border-radius: 4px;
}

select option {
	background-color: rgba(0, 0, 0, 0.9);
	color: #42b983;
}
</style>
