<template>
	<div class="character-selection-container">
		<div
			v-for="rival in RIVALS"
			:key="rival.name"
			@click="selectCharacter(rival.name)"
			:class="[
				'character-selection',
				{ selected: selectedRival === rival.name, disabled: !isSelectable(rival.name) },
			]"
		>
			<div class="character-image">
				<img :src="rival.iconPath" :alt="rival.name" :class="{ 'opponent-character': isOpponent }" :style="getShadowStyle(rival.name)" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RIVALS } from '@/constants'
import type { RivalName } from '@/types/roa2Types'

export default defineComponent({
	props: {
		allowedRivals: {
			type: Array as () => RivalName[],
			required: true,
		},
		selectedRival: {
			type: [String, null] as unknown as () => RivalName | null,
			required: true,
			validator: (value: unknown) => typeof value === 'string' || value === null,
		},
		isOpponent: {
			type: Boolean,
			default: false,
		},
		showWinrateShadow: {
			type: Boolean,
			default: false,
		},
		winrateMap: {
			type: Object as () => Record<RivalName, number>,
			default: () => ({} as Record<RivalName, number>),
		},
	},
	emits: ['characterSelected'],
	methods: {
		selectCharacter(rivalName: RivalName) {
			if (!this.isSelectable(rivalName)) return
			this.$emit('characterSelected', rivalName)
		},
		isSelectable(rivalName: RivalName) {
			return this.allowedRivals.includes(rivalName)
		},
		interpolateColor(t: number) {
			// clamp
			const v = Math.max(0, Math.min(1, t))
			// from red (#ef4444) to green (#22c55e)
			const r1 = 239, g1 = 68, b1 = 68
			const r2 = 34, g2 = 197, b2 = 94
			const r = Math.round(r1 + (r2 - r1) * v)
			const g = Math.round(g1 + (g2 - g1) * v)
			const b = Math.round(b1 + (b2 - b1) * v)
			return `rgba(${r}, ${g}, ${b}, 0.9)`
		},
		getShadowStyle(rivalName: RivalName) {
			if (!this.showWinrateShadow) return {}
			const wr = this.winrateMap?.[rivalName]
			if (wr === undefined || Number.isNaN(wr)) return {}
			const color = this.interpolateColor(wr)
			return {
				filter: `drop-shadow(0 0 2px ${color}) drop-shadow(0 8px 12px ${color})`,
			}
		},
	},
	data() {
		return {
			RIVALS,
		}
	},
	created() {
		if (!this.selectedRival) {
			const fallback = RIVALS.find((r) => r.name === this.allowedRivals[0])
			if (fallback) this.$emit('characterSelected', fallback.name)
		}
	},
})
</script>

<style scoped>
.character-selection-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	width: 100%;
	height: 100%;
	padding: 10px;
}

.character-selection {
	display: flex;
	width: 80px;
	height: 80px;
	margin: 5px;
	cursor: pointer;
}

.character-selection:hover {
	transform: scale(1.05);
	transition: transform 0.2s ease-in-out;
}

.character-image {
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: 10px;
}

.character-image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 10px;
}

.character-image img:hover {
	filter: brightness(0.8);
	transition: filter 0.2s ease-in-out;
}

.character-selection.selected {
	border: 3px solid turquoise;
	border-radius: 12px;
	box-sizing: border-box;
}

.character-selection.disabled {
	opacity: 0.2;
	pointer-events: none;
}

.opponent-character {
	transform: scaleX(-1);
}
</style>
