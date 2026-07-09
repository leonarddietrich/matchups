<template>
	<div
		class="selection-grid"
		:class="{ 'stage-grid': type === 'stages', 'character-grid': type === 'characters' }"
	>
		<!-- Characters grouped by element -->
		<template v-if="type === 'characters'">
			<div
				v-for="group in groupedRivals"
				:key="group.element"
				class="element-group"
				:style="{ '--element-color': elementColors[group.element] }"
			>
				<div
					v-for="rival in group.rivals"
					:key="rival.name"
					class="selection-option character-option"
					:class="{ selected: selectedValue === rival.name }"
					@click="select(rival.name)"
					:title="rival.name"
				>
					<img
						:src="rival.iconPath"
						:alt="rival.name"
						loading="lazy"
						decoding="async"
						:class="{ 'opponent-character': props.isOpponent }"
					/>
					<span class="icon-overlay-label">{{ rival.name }}</span>
				</div>
			</div>
		</template>

		<!-- Stages grid (2 rows of 5) -->
		<template v-else>
			<div
				v-for="stage in STAGES"
				:key="stage.name"
				class="selection-option stage-option"
				:class="{ selected: selectedValue === stage.name }"
				@click="select(stage.name)"
				:title="stage.name"
			>
				<picture>
					<source :srcset="getStageIcon(stage).webp" type="image/webp" />
					<img :src="getStageIcon(stage).png" :alt="stage.name" loading="lazy" decoding="async" />
				</picture>
				<span
					v-if="stageWinrates"
					class="winrate-badge"
					:style="getWinrateBadgeStyle(stage.name)"
					:title="getWinrateTitle(stage.name)"
				>
					{{ getWinrateLabel(stage.name) }}
				</span>
				<span v-if="stageWinrates" class="times-played">
					{{ stageWinrates[stage.name]?.timesPlayed ?? 0 }}
				</span>
				<span class="icon-overlay-label">{{ stage.name }}</span>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RIVALS, STAGES } from '@/constants/roa2'
import type { Stage, RivalElement, StageName } from '@/types/roa2Types'
import { getStageIconPathByName } from '@/scripts/roa2'
import { getWinrateColor } from '@/scripts/utils'
import { ImageFormat } from '@/types/shared/media'

export interface StageWinrate {
	timesPlayed: number
	percentage: number | undefined
}

interface Props {
	type: 'stages' | 'characters'
	modelValue?: string
	isOpponent?: boolean
	stageWinrates?: Record<string, StageWinrate>
}

const props = defineProps<Props>()

const emit = defineEmits<{
	'update:modelValue': [value: string]
}>()

const selectedValue = computed(() => props.modelValue)

function getWinrateLabel(stageName: StageName): string {
	const entry = props.stageWinrates?.[stageName]
	if (!entry || entry.timesPlayed === 0 || entry.percentage === undefined) return 'N/A'
	return `${Math.round(entry.percentage)}%`
}

function getWinrateTitle(stageName: StageName): string {
	const entry = props.stageWinrates?.[stageName]
	if (!entry || entry.timesPlayed === 0 || entry.percentage === undefined) {
		return `${stageName}: no prior rounds for this matchup`
	}
	return `${stageName}: ${Math.round(entry.percentage)}% predicted winrate (${entry.timesPlayed} round${entry.timesPlayed === 1 ? '' : 's'})`
}

function getWinrateBadgeStyle(stageName: StageName): Record<string, string> {
	const entry = props.stageWinrates?.[stageName]
	if (!entry || entry.timesPlayed === 0 || entry.percentage === undefined) {
		return { backgroundColor: 'rgba(0, 0, 0, 0.65)' }
	}
	return { backgroundColor: getWinrateColor(entry.percentage / 100) }
}

const elementColors: Record<RivalElement, string> = {
	Fire: 'rgba(200, 60, 40, 0.35)',
	Earth: 'rgba(90, 140, 50, 0.35)',
	Air: 'rgba(140, 110, 200, 0.35)',
	Water: 'rgba(50, 120, 200, 0.35)',
}

const groupedRivals = computed(() => {
	const order: RivalElement[] = ['Fire', 'Earth', 'Air', 'Water']
	return order.map((element) => ({
		element,
		rivals: RIVALS.filter((r) => r.element === element),
	}))
})

const stageIconCache = ref(new Map<string, { webp: string; png: string }>())

function getStageIcon(stage: Stage): { webp: string; png: string } {
	if (!stageIconCache.value.has(stage.name)) {
		stageIconCache.value.set(stage.name, {
			webp: getStageIconPathByName(stage.name, ImageFormat.WEBP),
			png: getStageIconPathByName(stage.name, ImageFormat.PNG),
		})
	}
	return stageIconCache.value.get(stage.name)!
}

function select(itemName: string) {
	emit('update:modelValue', itemName)
}
</script>

<style scoped>
.selection-grid {
	gap: 8px;
	padding: 4px;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 8px;
}

.stage-grid {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 4px;
}

.character-grid {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.element-group {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 4px;
	padding: 4px;
	border-radius: 8px;
	background-color: var(--element-color);
}

.selection-option {
	position: relative;
	cursor: pointer;
	border-radius: 8px;
	overflow: hidden;
	background: rgba(255, 255, 255, 0.05);
}

.selection-option.selected {
	background-color: rgba(66, 185, 131, 0.8);
	background-blend-mode: overlay;
}

/* Stage-specific overlay - only for stages */
.selection-option.selected.stage-option {
	background: rgba(255, 255, 255, 0.05); /* Reset background for stages */
	background-blend-mode: normal;
}

.selection-option.selected.stage-option::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(66, 185, 131, 0.6);
	z-index: 1;
	pointer-events: none;
}

.icon-overlay-label {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.7);
	color: white;
	padding: 4px 8px;
	font-size: 0.75rem;
	text-align: center;
	font-weight: 500;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
	z-index: 2;
}

.winrate-badge {
	position: absolute;
	top: 4px;
	left: 4px;
	min-width: 34px;
	padding: 2px 6px;
	border-radius: 6px;
	color: #fff;
	font-size: 0.8rem;
	font-weight: 700;
	text-align: center;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
	z-index: 3;
	pointer-events: none;
}

.times-played {
	position: absolute;
	top: 6px;
	right: 8px;
	color: #fff;
	font-size: 0.85rem;
	font-weight: bold;
	text-shadow: 0 0 3px #000, 0 1px 2px #000;
	z-index: 3;
	pointer-events: none;
}

.selection-option img,
.selection-option picture {
	width: 100%;
	height: auto;
	display: block;
}

.stage-option img,
.stage-option picture {
	aspect-ratio: 16/9;
	object-fit: cover;
}

.character-option img {
	aspect-ratio: 1;
	object-fit: cover;
}

.opponent-character {
	transform: scaleX(-1);
}
</style>
