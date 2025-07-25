<template>
	<div class="home">
		<h1>Home</h1>
		<p>
			Welcome to the Rivals of Aether Tournament Tracker! This application allows you to track your
			matches, view results, and analyze your performance.
		</p>
		<p>
			To get started, create a new match collection or upload existing data.
		</p>

		<!-- Match Collection Overview -->
		<div class="overview-container">
			<MatchCollectionOverview />
		</div>

		<!-- Action Buttons -->
		<div class="action-buttons">
			<button @click="showAddCollectionModal = true" class="action-btn primary-btn">
				<img class="button-icon" src="/src/assets/site/plus.svg" alt="Add" />
				Create Collection
			</button>
			<button @click="showUploadModal = true" class="action-btn secondary-btn">
				<img class="button-icon" src="/src/assets/site/upload.svg" alt="Upload" />
				Upload CSV
			</button>
			<button @click="showJsonUploadModal = true" class="action-btn secondary-btn">
				<img class="button-icon" src="/src/assets/site/upload.svg" alt="Upload JSON" />
				Upload JSON
			</button>
		</div>

		<!-- Development Tools -->
		<div class="dev-tools">
			<button
				style="color: yellow"
				@click="useExampleMatches"
				:disabled="exampleCollectionExists"
				:title="exampleCollectionExists ? 'Example collection already exists' : 'Add 50 example matches'"
			>
				{{ exampleCollectionExists ? 'Example matches loaded' : 'Use example matches' }}
			</button>
			<button style="color: red" @click="resetStore">reset matches</button>
		</div>

		<!-- Modals -->
		<AddCollectionModal
			:display="showAddCollectionModal"
			@closeAddCollectionModal="showAddCollectionModal = false"
		/>
		<CSVUploadModal
			:display="showUploadModal"
			@closeCSVUploadModal="showUploadModal = false"
		/>
		<JsonUploadModal
			:display="showJsonUploadModal"
			@closeJsonUploadModal="showJsonUploadModal = false"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'
import MatchCollectionOverview from '@/components/MatchCollectionOverview.vue'
import AddCollectionModal from '@/components/AddCollectionModal.vue'
import CSVUploadModal from '@/components/CSVUploadModal.vue'
import JsonUploadModal from '@/components/JsonUploadModal.vue'
import { generateExampleCollectionData, EXAMPLE_COLLECTION_NAME } from '@/scripts/example'

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

// Helper functions for ID generation
function getNextAvailableCollectionId(): number {
	const existingIds = matchStore.matchCollections.map(c => c.id)
	if (existingIds.length === 0) return 1
	return Math.max(...existingIds) + 1
}

const showAddCollectionModal = ref(false)
const showUploadModal = ref(false)
const showJsonUploadModal = ref(false)

// Check if example collection exists
const exampleCollectionExists = computed(() => {
	return matchStore.matchCollections.some(collection => collection.name === EXAMPLE_COLLECTION_NAME)
})

function useExampleMatches() {
	const collectionId = getNextAvailableCollectionId()
	const exampleCollection = generateExampleCollectionData(collectionId)
	matchStore.addMatchCollection(exampleCollection)
}

function resetStore() {
	matchStore.resetStore()
	selectionStore.resetMatchCollectionId()
	selectionStore.resetCharacterSelection()
	alert('Matches and selections have been reset.')
}
</script>

<style scoped lang="css">
.home {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	padding: 20px;
	background-color: #000000b0;
	min-height: 100vh;
	width: 100%;
	max-width: 1400px;
	margin: 0 auto;
}

h1 {
	font-size: 2em;
	margin-bottom: 20px;
	color: white;
}

p {
	font-size: 1.2em;
	margin: 10px 0;
	color: white;
	text-align: center;
	max-width: 800px;
}

.action-buttons {
	display: flex;
	gap: 1rem;
	margin: 2rem 0;
	justify-content: center;
}

.action-btn {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	border: none;
	border-radius: 8px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	text-decoration: none;
}

.primary-btn {
	background-color: #42b983;
	color: white;
}

.primary-btn:hover {
	background-color: #369870;
	transform: translateY(-2px);
}

.secondary-btn {
	background-color: #6c757d;
	color: white;
}

.secondary-btn:hover {
	background-color: #5a6268;
	transform: translateY(-2px);
}

.button-icon {
	width: 20px;
	height: 20px;
	filter: invert(1);
}

.dev-tools {
	margin-top: 2rem;
	padding-top: 2rem;
	border-top: 1px solid rgba(255, 255, 255, 0.2);
	display: flex;
	gap: 1rem;
}

.dev-tools button {
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-weight: 600;
	background-color: rgba(0, 0, 0, 0.5);
	border: 1px solid currentColor;
}

.overview-container {
	width: 100%;
	margin: 2rem 0;
}
</style>
