import { defineStore } from 'pinia'
import type { RivalName } from '../scripts/roa2'

export const useSelectionStore = defineStore('selectionStore', {
	state: () => ({
		matchCollectionId: null as number | null,
		playerCharacter: null as RivalName | null,
		opponentCharacter: null as RivalName | null,
	}),
	actions: {
		setPlayerCharacter(character: RivalName | null) {
			console.info('Setting player character:', character)
			this.playerCharacter = character
		},
		setOpponentCharacter(character: RivalName | null) {
			console.info('Setting opponent character:', character)
			this.opponentCharacter = character
		},
		resetCharacterSelection() {
			console.info('Resetting character selection')
			this.playerCharacter = null
			this.opponentCharacter = null
		},
		setMatchCollectionId(id: number) {
			console.info('Setting match collection ID:', id)
			this.matchCollectionId = id
		},
		resetMatchCollectionId() {
			console.info('Resetting match collection ID')
			this.matchCollectionId = null
		},
	},
	getters: {
		getselectedMatchCollectionId: (state) => {
			return state.matchCollectionId
		},
		getPlayerCharacter: (state) => {
			return state.playerCharacter
		},
		getOpponentCharacter: (state) => {
			return state.opponentCharacter
		},
	},
})
