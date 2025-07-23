<template>
	<BaseModal :show="props.display" @close="$emit('closeFileUploadModal')">
		<template v-slot:header>
			<h3>Upload Matches</h3>
		</template>
		<template v-slot:body>
			<p>Upload your match data here.</p>
			<input type="file" accept=".csv" @change="onFileChange" />
			<HeaderSelector
				v-if="csvHeader.length > 0"
				:headers="csvHeader"
				@mapping-changed="onMappingChanged"
			/>
			<div v-if="isMappingComplete">
				<p>Header mapping is complete. Specify match collection</p>
				<input type="number" placeholder="Match Collection ID" v-model="matchCollectionId" />
				<input type="text" placeholder="Match Collection Name" v-model="matchCollectionName" />
				<input
					type="text"
					placeholder="Match Collection Description"
					v-model="matchCollectionDescription"
				/>
				<input
					type="text"
					placeholder="Match Collection Type ( ranked | casual | friendly | tournament )"
					v-model="matchCollectionType"
				/>
			</div>
		</template>
		<template v-slot:footer>
			<button @click="$emit('closeFileUploadModal')">Close</button>
			<button :disabled="!isMatchCollectionComplete" @click="buildAndSaveCollection()">
				Save Match Collection
			</button>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import HeaderSelector from './HeaderSelector.vue'
import type {
	Match,
	RankedMatch,
	MatchType,
	Round,
	RivalName,
	StageName,
	MatchCollection,
} from '@/scripts/roa2'
import { useMatchStore } from '../stores/matchStore'

const matchStore = useMatchStore()

const emit = defineEmits(['closeFileUploadModal'])

const props = defineProps<{
	display: boolean
}>()

const matchDataMapping = {
	id: 0,
	playerElo: 1,
	opponentElo: 2,
	opponentName: 3,
	stage: 4,
	playerRival: 5,
	opponentRival: 6,
	won: 7,
	links: 8, // assuming links is the last column
}

const matchCollectionId = ref<number>(0)
const matchCollectionName = ref<string>('')
const matchCollectionDescription = ref<string>('')
const matchCollectionType = ref<MatchType>('ranked')

const isMatchCollectionComplete = computed(() => {
	return (
		matchCollectionId.value &&
		matchCollectionName.value.trim() !== '' &&
		matchCollectionDescription.value.trim() !== '' &&
		['ranked', 'casual', 'friendly', 'tournament'].includes(matchCollectionType.value)
	)
})

const csvHeader = ref<string[]>([])
const csvData = ref<string[][]>([])
const headerMappings = ref<number[]>([])

const isMappingComplete = computed(() => {
	return headerIsValid(headerMappings.value)
})

function headerIsValid(mappings: number[]): boolean {
	if (mappings.length !== Object.keys(matchDataMapping).length) return false
	const uniqueMappings = new Set()
	const maxIndex = csvHeader.value.length - 1
	for (let i = 0; i < mappings.length; i++) {
		if (mappings[i] < 0 && i < mappings.length - 1) {
			return false // all mappings must be set except for the last one
		}
		if (mappings[i] > maxIndex) {
			return false // mapping index must be within the range of available headers
		}
		if (uniqueMappings.has(mappings[i])) {
			return false // no duplicate mappings allowed
		}
		uniqueMappings.add(mappings[i])
	}
	return true
}

function onFileChange(event: Event) {
	const input = event.target as HTMLInputElement
	if (input.files && input.files.length > 0) {
		const file = input.files[0]
		console.log('Selected file:', file.name)
		console.log(file)
		console.log('File type:', file.type)
		const reader = new FileReader()
		reader.onload = (e) => {
			const content = e.target?.result
			if (typeof content === 'string') {
				// process file content into a 2D array by columns
				const rows = content.split('\n').map((row) => row.split(','))
				csvHeader.value = rows[0] // assuming the first row is the header
				csvData.value = rows.slice(1) // the rest are data rows
			} else {
				console.error('File content is not a string')
			}
		}
		reader.onerror = (e) => {
			console.error('Error reading file:', e)
		}
		reader.readAsText(file)
	}
}

function onMappingChanged(mappings: number[]) {
	headerMappings.value = mappings
	console.log('Header mappings:', mappings)
}

function isWin(value: string): boolean {
	return value.toLowerCase() == 'win' || value.toLowerCase() === 'true' || value === '1'
}

function buildAndSaveCollection() {
	const matchCollection: MatchCollection | void = buildCollection()
	if (!matchCollection) {
		console.error('Failed to build match collection')
		return
	}
	matchStore.addMatchCollection(matchCollection)
	console.log('Match collection saved. Closing modal.')
	emit('closeFileUploadModal')
}

function buildCollection(): MatchCollection | void {
	if (!isMappingComplete.value) {
		console.error('Header mapping is not complete or valid')
		return
	}

	const rows = csvData.value

	const matches: Match[] | RankedMatch[] = []
	let index = -1
	let lastId = -1

	let match: Match | RankedMatch | null = null
	while (++index < csvData.value.length) {
		const stage: StageName = rows[index][headerMappings.value[matchDataMapping.stage]] as StageName
		const playerRival: RivalName = rows[index][
			headerMappings.value[matchDataMapping.playerRival]
		] as RivalName
		const opponentRival: RivalName = rows[index][
			headerMappings.value[matchDataMapping.opponentRival]
		] as RivalName
		const won: boolean = isWin(rows[index][headerMappings.value[matchDataMapping.won]])
		const round: Round = {
			stage: stage,
			playerRival: playerRival,
			opponentRival: opponentRival,
			won: won,
		}

		const id: number = parseInt(rows[index][headerMappings.value[matchDataMapping.id]])

		if (id !== lastId) {
			if (match !== null) {
				matches.push(match)
			}
			lastId = id
			const playerElo: number = parseInt(
				rows[index][headerMappings.value[matchDataMapping.playerElo]],
			)
			const opponentElo: number = parseInt(
				rows[index][headerMappings.value[matchDataMapping.opponentElo]],
			)
			const opponentName: string = rows[index][headerMappings.value[matchDataMapping.opponentName]]
			const links: { text: string; link: string }[] = rows[index][
				headerMappings.value[matchDataMapping.links]
			]
				? JSON.parse(rows[index][headerMappings.value[matchDataMapping.links]])
				: []
			match = {
				id: id,
				playerElo: playerElo,
				opponentElo: opponentElo,
				opponentName: opponentName,
				rounds: [],
				links: links,
			}
		}
		if (match) {
			match.rounds.push(round)
		} else {
			console.error('Match is null, cannot add round:', rows[index])
		}
	}
	if (match !== null) {
		matches.push(match)
	}

	const date = new Date().toISOString()

	const matchCollection = {
		id: matchCollectionId.value,
		createdAt: date,
		updatedAt: date,
		name: matchCollectionName.value,
		type: matchCollectionType.value,
		description: matchCollectionDescription.value,
		matches: matches,
	}

	console.log('Building match collection:', matchCollection)
	return matchCollection
}
</script>
