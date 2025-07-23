<template>
	<div class="match-body-rounds">
		<div :class="`match-body-round-${result}`">
			<img :src="stageImg.src" class="mx-auto p-1" :alt="stageImg.alt" />
			<img :src="playerImg.src" class="match-body-character mx-auto p-1" :alt="playerImg.alt" />
			<img :src="opponentImg.src" class="match-body-character mx-auto p-1" :alt="opponentImg.alt" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { getRivalIconPathByName, getStageIconPathByName } from '@/scripts/roa2'
import type { StageName, RivalName } from '@/types/roa2Types'

const props = defineProps<{
	stage: StageName
	player: RivalName
	opponent: RivalName
	result: boolean
}>()

const result = computed(() => {
	return props.result ? 'win' : 'loss'
})

const stageImg = computed(() => {
	const iconPath = getStageIconPathByName(props.stage)
	return getPathToImage(props.stage, iconPath)
})
const playerImg = computed(() => {
	const iconPath = getRivalIconPathByName(props.player)
	return getPathToImage(props.player, iconPath)
})
const opponentImg = computed(() => {
	const iconPath = getRivalIconPathByName(props.opponent)
	return getPathToImage(props.opponent, iconPath)
})

function getPathToImage(imageName: string, pathToImage: string) {
	if (!pathToImage || pathToImage === '') {
		console.warn(`Image not found: ${imageName}`)
		return { src: '', alt: imageName }
	}
	// The imported assets are already processed URLs by Vite
	return {
		src: pathToImage,
		alt: imageName,
	}
}
</script>

<style scoped>
.p-1 {
	padding: 8px;
}

img {
	height: 99px;
	width: 176px;
}

.match-body-rounds {
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	text-align: center;
}

.match-body-round-win {
	background-color: rgba(132, 255, 138, 0.2);
}

.match-body-round-loss {
	background-color: rgba(255, 132, 132, 0.2);
}

.match-body-character {
	height: 100px;
	width: 100px;
}
</style>
