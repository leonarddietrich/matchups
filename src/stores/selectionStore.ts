/** Selection Store
 * This store manages the selection of match collections, player characters, opponent characters,
 * and filters for matches. It provides methods to set and reset selections, as well as to
 * load and save selections to session storage.
 */

import { defineStore } from 'pinia'
import type { RivalName, MatchFilters } from '@/types/roa2Types'
import { SESSION_STORAGE_KEYS } from '@/constants'

export const useSelectionStore = defineStore('selectionStore', {
	state: () => ({
		matchCollectionName: null as string | null,
		playerCharacter: null as RivalName | null,
		opponentCharacter: null as RivalName | null,
		currentFilters: {} as MatchFilters,
	}),
	actions: {
		/**
		 * Initializes the selection store by loading match collection name and filters from session storage.
		 * This should be called when the application starts to restore previous state.
		 */
		loadFromStorage() {
			const activeMatchRaw = sessionStorage.getItem(SESSION_STORAGE_KEYS.ACTIVE_MATCH_COLLECTION)
			if (activeMatchRaw) {
				try {
					const name = JSON.parse(activeMatchRaw) as string
					this.matchCollectionName = name
					console.info('Loaded match collection name from storage:', name)
				} catch (error) {
					console.error('Failed to parse match collection name from storage:', error)
				}
			}

			const filtersRaw = sessionStorage.getItem(SESSION_STORAGE_KEYS.MATCH_FILTERS)
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
			sessionStorage.setItem(SESSION_STORAGE_KEYS.ACTIVE_MATCH_COLLECTION, JSON.stringify(name))
			this.resetFilters()
		},
		resetMatchCollectionName() {
			console.info('Resetting match collection name')
			this.matchCollectionName = null
			sessionStorage.removeItem(SESSION_STORAGE_KEYS.ACTIVE_MATCH_COLLECTION)
		},
		setFilters(filters: MatchFilters) {
			console.info('Setting filters:', filters)
			this.currentFilters = filters
			sessionStorage.setItem(SESSION_STORAGE_KEYS.MATCH_FILTERS, JSON.stringify(filters))
		},
		resetFilters() {
			console.info('Resetting filters')
			this.currentFilters = {}
			sessionStorage.removeItem(SESSION_STORAGE_KEYS.MATCH_FILTERS)
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
