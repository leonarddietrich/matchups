<template>
	<div class="home">
		<h1>Home</h1>
		<p>
			Welcome to the Rivals of Aether Tournament Tracker! This application allows you to track your
			matches, view results, and analyze your performance.
		</p>
		<p>
			To get started, navigate to the Matches page to view your match history or add new matches.
		</p>

		<button style="color: yellow" @click="useExampleMatches">use example matches</button>
		<button style="color: red" @click="resetStore">reset matches</button>"
		<button style="color: green" @click="toggleDisplayUploadModal">upload matches</button>

		<FileUploadModal :display="showUploadModal" @closeFileUploadModal="toggleDisplayUploadModal()">
		</FileUploadModal>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUploadModal from '@/components/FileUploadModal.vue'
import type { MatchCollection, Match } from '@/types/roa2Types'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()

const showUploadModal = ref(false)

const exampleMatches: Match[] = [
	{
		id: 1,
		opponentName: 'some name',
		opponentElo: 1200,
		playerElo: 1200,
		rounds: [
			{
				stage: 'Aetherian Forest',
				playerRival: 'Orcane',
				opponentRival: 'Zetterburn',
				won: true,
			},
			{
				stage: 'Air Armada',
				playerRival: 'Orcane',
				opponentRival: 'Zetterburn',
				won: false,
			},
			{
				stage: 'Hodojo',
				playerRival: 'Kragg',
				opponentRival: 'Zetterburn',
				won: true,
			},
		],
		links: [
			{
				text: 'some text',
				link: 'somelink.com',
			},
		],
	},
	{
		id: 2,
		opponentName: 'some name',
		opponentElo: 1200,
		playerElo: 1300,
		rounds: [
			{
				stage: 'Godai Delta',
				playerRival: 'Orcane',
				opponentRival: 'Clairen',
				won: false,
			},
			{
				stage: 'Hyperborean Harbor',
				playerRival: 'Orcane',
				opponentRival: 'Clairen',
				won: false,
			},
		],
		links: [],
	},
	{
		id: 3,
		opponentName: 'some name',
		opponentElo: 1200,
		playerElo: 1300,
		rounds: [
			{
				stage: 'Julesvale',
				playerRival: 'Orcane',
				opponentRival: 'Loxodont',
				won: true,
			},
		],
		links: [],
	},
	{
		id: 4,
		opponentName: 'some name',
		opponentElo: 1200,
		playerElo: 1200,
		rounds: [
			{
				stage: 'Rock Wall',
				playerRival: 'Orcane',
				opponentRival: 'Ranno',
				won: false,
			},
			{
				stage: 'Hyperborean Harbor',
				playerRival: 'Orcane',
				opponentRival: 'Ranno',
				won: true,
			},
			{
				stage: 'Hodojo',
				playerRival: 'Orcane',
				opponentRival: 'Orcane',
				won: true,
			},
		],
		links: [
			{
				text: 'some text',
				link: 'somelink.com',
			},
		],
	},
]

const exampleMatchCollection: MatchCollection = {
	id: 1,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	name: 'Example Match Collection',
	type: 'ranked',
	description: 'This is an example match collection with sample matches.',
	matches: exampleMatches,
}

function useExampleMatches() {
	matchStore.addMatchCollection(exampleMatchCollection)
}

function resetStore() {
	matchStore.resetStore()
	selectionStore.resetMatchCollectionId()
	selectionStore.resetCharacterSelection()
	alert('Matches and selections have been reset.')
}

function toggleDisplayUploadModal() {
	showUploadModal.value = !showUploadModal.value
}
</script>

<style scoped lang="css">
.home {
	display: grid;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px;
	background-color: #000000b0;
}
h1 {
	font-size: 2em;
	margin-bottom: 20px;
}
p {
	font-size: 1.2em;
	margin: 10px 0;
}
</style>
