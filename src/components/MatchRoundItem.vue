<template>
	<div class="match-body-rounds">
		<div
			:class="`match-body-round match-body-round-${result}`"
			:style="{ backgroundImage: `url(${stageImg.png})` }"
		>
			<img :src="playerImg.src" class="match-body-character mx-auto p-1" :alt="playerImg.alt" />
			<img :src="opponentImg.src" class="match-body-character opponent-character mx-auto p-1" :alt="opponentImg.alt" />
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

.match-body-round {
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-around;
	min-height: 120px;
	border-radius: 8px;
	overflow: hidden;
	border: 3px solid transparent;
}

.match-body-round-win {
	border-color: #00bd7e;
}

.match-body-round-loss {
	border-color: #e53e3e;
}

.match-body-round-win::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #00bd7e30;
	z-index: 1;
}

.match-body-round-loss::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #e53e3e30;
	z-index: 1;
}

.match-body-character {
	height: 100px;
	width: 100px;
	position: relative;
	z-index: 10;
	filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

.opponent-character {
	transform: scaleX(-1);
}
</style>
