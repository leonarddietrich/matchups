<template>
	<div class="selection-grid" :class="{ 'stage-grid': type === 'stages', 'character-grid': type === 'characters' }">
		<div
			v-for="item in availableItems"
			:key="item.name"
			class="selection-option"
			:class="{ 'selected': selectedValue === item.name, 'stage-option': type === 'stages', 'character-option': type === 'characters' }"
			@click="select(item.name)"
			:title="item.name"
		>
			<picture v-if="type === 'stages'">
				<source :srcset="getStageIcon(item as Stage).webp" type="image/webp" />
				<img :src="getStageIcon(item as Stage).png" :alt="item.name" loading="lazy" />
			</picture>
			<img v-else :src="item.iconPath" :alt="item.name" loading="lazy" />
			<span class="icon-overlay-label">{{ item.name }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RIVALS, STAGES } from '@/constants/roa2'
import type { Stage } from '@/types/roa2Types'
import { getStageIconPathByName } from '@/scripts/roa2'
import { ImageFormat } from '@/types/shared/media'

interface Props {
	type: 'stages' | 'characters'
	modelValue?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	'update:modelValue': [value: string]
}>()

const selectedValue = computed(() => props.modelValue)

const availableItems = computed(() => {
	if (props.type === 'stages') {
		return STAGES
	} else {
		return RIVALS
	}
})

function getStageIcon(stage: Stage): { webp: string; png: string } {
	return {
		webp: getStageIconPathByName(stage.name, ImageFormat.WEBP),
		png: getStageIconPathByName(stage.name, ImageFormat.PNG),
	}
}

function select(itemName: string) {
	emit('update:modelValue', itemName)
}
</script>

<style scoped>
.selection-grid {
	display: grid;
	gap: 8px;
	padding: 8px;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 8px;
}

.stage-grid {
	grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}

.character-grid {
	grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
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
</style>
