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
				<img :src="rival.iconPath" :alt="rival.name" />
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
</style>
