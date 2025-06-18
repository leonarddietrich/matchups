<template>
	<div class="match-display" id="matchesDisplay" v-if="matchCollection">
		<MatchItem v-for="match in matchCollection.matches" :key="match.id" v-bind:match></MatchItem>
	</div>
	<BaseModal :show="showUploadModal" @close="showUploadModal = false">
		<template v-slot:header><h3>Upload Matches</h3></template></BaseModal
	>
	<BaseModal :show="showAddMatchModal" @close="showAddMatchModal = false">
		<template v-slot:header>
			<h3>Add Match</h3>
		</template>
	</BaseModal>
	<button
		v-if="!(showAddMatchModal || showUploadModal)"
		class="open-modal"
		@click="showAddMatchModal = true"
		style="bottom: 10px; right: 10px"
	>
		<img class="button-icon" src="/src/assets/site/plus.svg" alt="Upload" />
	</button>
	<button
		v-if="!(showAddMatchModal || showUploadModal)"
		class="open-modal"
		@click="showUploadModal = true"
		style="bottom: 10px; right: 60px"
	>
		<img class="button-icon" src="/src/assets/site/upload.svg" alt="Upload" />
	</button>
</template>

<script lang="ts" setup>
import MatchItem from '../components/MatchItem.vue'
import BaseModal from '../components/BaseModal.vue'
import { ref } from 'vue'
import { useMatchStore } from '../stores/matchStore'
import { useSelectionStore } from '../stores/selectionStore'
import type { MatchCollection } from '../scripts/roa2'

const showUploadModal = ref(false)
const showAddMatchModal = ref(false)

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

import { computed } from 'vue'

const matchCollection = computed<MatchCollection | null>(() => {
	const id = selectionStore.getselectedMatchCollectionId
	if (id === null) {
		console.warn('No match collection selected')
		return null
	}
	return matchStore.getMatchCollectionById(id)
})
</script>

<style scoped lang="css">
.match-display {
	display: flex;
	border-radius: 8px;
	padding: 1rem;
	gap: 1rem;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	width: 100%;
	max-width: none;
	box-sizing: border-box;
	/* margin: 0 auto; */
}

.open-modal {
	position: fixed;
	width: 40px;
	height: 40px;
	background-color: #42b983;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	filter: invert(1);
}

.button-icon {
	width: 24px;
	height: 24px;
}
</style>
