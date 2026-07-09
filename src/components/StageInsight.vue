<template>
	<div class="stages-flex">
		<div v-for="stage in stagePerformance" :key="stage.name" class="stage-item">
			<div class="icon-container">
				<picture>
					<source :srcset="stage.iconPathWebp" type="image/webp" />
					<img :src="stage.iconPath" :alt="stage.name" class="stage-icon" loading="lazy" />
				</picture>
				<span class="times-played">{{ stage.timesPlayed }}</span>
				<span v-if="stage.timesPlayed > 0" class="win-percentage">
					{{ Math.round(stage.percentage ?? 0) }}%
				</span>
				<span v-else class="win-percentage">N/A</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { StagePerformance } from '@/types/roa2Types'

defineProps<{ stagePerformance: StagePerformance[] }>()
</script>

<style scoped>
.stages-flex {
	display: grid;
	grid-template-columns: repeat(5, 130px);
	gap: 18px;
	justify-content: center;
}

.stage-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 130px;
}

.icon-container {
	position: relative;
	width: 130px;
	height: 130px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.stage-icon {
	width: 130px;
	height: 130px;
	display: block;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	object-fit: cover;
}

.win-percentage {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 39px;
	background: rgba(0, 0, 0, 0.5);
	color: #fff;
	border-radius: 0 0 12px 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5rem;
	font-weight: bold;
	pointer-events: none;
	white-space: nowrap;
	width: 100%;
	gap: 6px;
}

.win-ratio {
	font-size: 0.9rem;
	font-weight: normal;
	opacity: 0.85;
}

.times-played {
	position: absolute;
	top: 6px;
	right: 8px;
	color: #fff;
	font-size: 0.85rem;
	font-weight: bold;
	text-shadow: 0 0 3px #000, 0 1px 2px #000;
	pointer-events: none;
}
</style>
