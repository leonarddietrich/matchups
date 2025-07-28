import { defineStore } from 'pinia'
import type { RivalName, MatchFilters } from '@/types/roa2Types'
import { STORAGE_KEYS } from '@/constants'

export const useSelectionStore = defineStore('selectionStore', {
	state: () => ({
		matchCollectionName: null as string | null,
		playerCharacter: null as RivalName | null,
		opponentCharacter: null as RivalName | null,
		currentFilters: {} as MatchFilters,
	}),
	actions: {
		/**
		 * Loads the active match collection name from localStorage.
		 * This should be called when the application starts to restore the previous selection.
		 */
		loadFromStorage() {
			// Load match collection name
			const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_MATCH_COLLECTION_ID)
			if (raw) {
				try {
					const name = JSON.parse(raw) as string
					this.matchCollectionName = name
					console.info('Loaded match collection name from storage:', name)
				} catch (error) {
					console.error('Failed to parse match collection name from storage:', error)
				}
			}

			// Load filters
			const filtersRaw = localStorage.getItem(STORAGE_KEYS.MATCH_FILTERS)
			if (filtersRaw) {
				try {
					const filters = JSON.parse(filtersRaw) as MatchFilters
					this.currentFilters = filters
					console.info('Loaded filters from storage:', filters)
				} catch (error) {
					console.error('Failed to parse filters from storage:', error)
				}
			}
		},
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
		setMatchCollectionName(name: string) {
			console.info('Setting match collection name:', name)
			this.matchCollectionName = name
			// Save to localStorage
			localStorage.setItem(STORAGE_KEYS.ACTIVE_MATCH_COLLECTION_ID, JSON.stringify(name))
			// Reset filters when changing match collection
			this.resetFilters()
		},
		resetMatchCollectionName() {
			console.info('Resetting match collection name')
			this.matchCollectionName = null
			// Remove from localStorage
			localStorage.removeItem(STORAGE_KEYS.ACTIVE_MATCH_COLLECTION_ID)
		},
		setFilters(filters: MatchFilters) {
			console.info('Setting filters:', filters)
			this.currentFilters = filters
			// Save to localStorage
			localStorage.setItem(STORAGE_KEYS.MATCH_FILTERS, JSON.stringify(filters))
		},
		resetFilters() {
			console.info('Resetting filters')
			this.currentFilters = {}
			// Remove from localStorage
			localStorage.removeItem(STORAGE_KEYS.MATCH_FILTERS)
		},
	},
	getters: {
		getSelectedMatchCollectionName: (state) => {
			return state.matchCollectionName
		},
		getPlayerCharacter: (state) => {
			return state.playerCharacter
		},
		getOpponentCharacter: (state) => {
			return state.opponentCharacter
		},
		getCurrentFilters: (state) => {
			return state.currentFilters
		},
		hasActiveFilters: (state) => {
			return !!(
				(state.currentFilters.stages && state.currentFilters.stages.length > 0) ||
				(state.currentFilters.playerCharacter && state.currentFilters.playerCharacter.length > 0) ||
				(state.currentFilters.opponentCharacter && state.currentFilters.opponentCharacter.length > 0) ||
				state.currentFilters.results ||
				state.currentFilters.difficulty
			)
		},
	},
})
