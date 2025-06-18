<template>
	<div class="character-selection-container">
		<div
			v-for="rival in RIVALS"
			:key="rival.name"
			@click="selectCaracter(rival)"
			:class="[
				'character-selection',
				{ selected: selected && selected.name === rival.name, disabled: !isSelectable(rival) },
			]"
		>
			<div class="character-image">
				<img :src="rival.iconPath" :alt="rival.name" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RIVALS } from '@/scripts/roa2'
import type { Rival, RivalName } from '@/scripts/roa2'

export default defineComponent({
	props: {
		allowedRivals: {
			type: Array<RivalName>,
			required: true,
			validator: (value) =>
				Array.isArray(value) &&
				value.every((rivalName) => RIVALS.some((r) => r.name === rivalName)),
		},
		selectedRival: {
			type: String,
			required: false,
			default: null,
			validator: (value) => value === null || RIVALS.some((rival) => rival.name === value),
		},
	},
	emits: ['characterSelected'],
	methods: {
		selectCaracter(rival: Rival) {
			if (!this.isSelectable(rival)) return
			this.selected = rival
			this.$emit('characterSelected', rival.name)
		},
		isSelectable(rival: Rival) {
			return this.allowedRivals.includes(rival.name)
		},
	},
	data() {
		return {
			RIVALS,
			selected: null as Rival | null,
		}
	},
	created() {
		if (this.selectedRival) {
			const rival = this.RIVALS.find((r) => r.name === this.selectedRival)
			if (rival) this.selected = rival
		} else {
			const fallback = this.RIVALS.find((r) => r.name === this.allowedRivals[0])
			if (fallback) this.selected = fallback
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
	opacity: 0.5;
	pointer-events: none;
}
</style>
