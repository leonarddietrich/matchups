<template>
	<div class="matchup-pair" :class="{ 'has-stages': stages.length > 0 }">
		<div v-if="stages.length" class="stage-bg">
			<img
				v-for="(stage, index) in stages"
				:key="stage.name"
				class="stage-slice"
				:src="stage.iconPath"
				:alt="stage.name"
				:title="stage.name"
				:style="{ clipPath: stageClip(index, stages.length) }"
			/>
		</div>
		<img class="matchup-icon" :src="player.iconPath" :alt="player.name" />
		<img class="matchup-icon opponent" :src="opponent.iconPath" :alt="opponent.name" />
	</div>
</template>

<script setup lang="ts">
import type { Rival, Stage } from '@/types/roa2Types';

withDefaults(
	defineProps<{
		player: Rival;
		opponent: Rival;
		/** Stage icon(s) rendered behind the pair, split diagonally when several tie. */
		stages?: Stage[];
	}>(),
	{ stages: () => [] },
);

/**
 * Builds a diagonal clip-path so that `count` stage icons can be layered inside
 * one box as evenly sized, slightly slanted slices (e.g. 50/50 for two stages).
 */
function stageClip(index: number, count: number): string {
	if (count <= 1) return 'none';
	const diagonal = 12; // horizontal offset (in %) that slants each divider
	const left = index === 0 ? -50 : (index / count) * 100;
	const right = index === count - 1 ? 150 : ((index + 1) / count) * 100;
	return `polygon(${left + diagonal}% 0, ${right + diagonal}% 0, ${right - diagonal}% 100%, ${left - diagonal}% 100%)`;
}
</script>

<style scoped>
.matchup-pair {
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.25rem 0.5rem;
	border-radius: 8px;
	background: rgba(0, 0, 0, 0.2);
	overflow: hidden;
}

.stage-bg {
	position: absolute;
	inset: 0;
	z-index: 0;
}

.stage-slice {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

/* Darken the stage art so the character icons stay legible on top. */
.matchup-pair.has-stages::after {
	content: '';
	position: absolute;
	inset: 0;
	z-index: 1;
	background: rgba(0, 0, 0, 0.4);
}

.matchup-icon {
	position: relative;
	z-index: 2;
	width: 48px;
	height: 48px;
	object-fit: cover;
	border-radius: 8px;
	filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.8));
}

.matchup-icon.opponent {
	transform: scaleX(-1);
}
</style>
