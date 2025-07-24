<template>
	<select v-model="selectedId" @change="(Event) => updateSelection(Event)">
		<option v-if="!matchCollections.length" disabled value="">no match collection</option>
		<option v-for="collection in matchCollections" :key="collection.id" :value="collection.id">
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
const selectedId = computed({
	get: () => selectionStore.getselectedMatchCollectionId,
	set: (val: number) => selectionStore.setMatchCollectionId(val),
})

function updateSelection(event: Event) {
	const newId = (event.target as HTMLSelectElement).value
	selectedId.value = Number(newId)
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
