<template>
	<div class="stages-flex">
		<div v-for="stage in stagePerformance" :key="stage.name" class="stage-item">
			<div class="icon-container">
				<picture>
					<source :srcset="stage.iconPathWebp" type="image/webp" />
					<img :src="stage.iconPath" :alt="stage.name" class="stage-icon" loading="lazy" />
				</picture>
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
	display: flex;
	flex-wrap: wrap;
	gap: 20px 2px; /* 20px vertikal, 2px horizontal */
	justify-content: center;
	align-items: flex-start;
}

.stage-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 180px;
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
}
</style>
