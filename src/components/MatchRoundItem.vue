<template>
	<div class="match-body-rounds">
		<div :class="`match-body-round-${result}`">
			<picture>
				<source :srcset="stageImg.webp" type="image/webp" />
				<img :src="stageImg.png" class="mx-auto p-1" :alt="stageImg.alt" loading="lazy" />
			</picture>
			<img :src="playerImg.src" class="match-body-character mx-auto p-1" :alt="playerImg.alt" />
			<img :src="opponentImg.src" class="match-body-character mx-auto p-1" :alt="opponentImg.alt" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { getRivalIconPathByName, getStageIconPathByName } from '@/scripts/roa2'
import { ImageFormat } from '@/types/shared/media'
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
	const webp = getStageIconPathByName(props.stage, ImageFormat.WEBP)
	const png = getStageIconPathByName(props.stage, ImageFormat.PNG)
	return {
		webp,
		png,
		alt: props.stage,
	}
})
const playerImg = computed(() => {
	const iconPath = getRivalIconPathByName(props.player)
	return { src: iconPath, alt: props.player }
})
const opponentImg = computed(() => {
	const iconPath = getRivalIconPathByName(props.opponent)
	return { src: iconPath, alt: props.opponent }
})
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
