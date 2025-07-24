import { defineStore } from 'pinia'
import type { MatchCollection, Match, RankedMatch } from '../types/roa2Types'
import { STORAGE_KEYS } from '@/constants'

export const useMatchStore = defineStore('matchStore', {
	state: () => ({
		matchCollectionIdList: [] as number[],
		matchCollections: [] as MatchCollection[],
	}),
	getters: {
		/**
		 * Returns the list of match collection IDs.
		 * This is used to keep track of all match collections available in the store.
		 * @returns list of numbers.
		 */
		getMatchCollectionIdList: (state) => {
			return state.matchCollectionIdList
		},
		/**
		 * Returns the list of match collections.
		 * This is used to access all match collections available in the store.
		 * @param id : number - The ID of the match collection to retrieve.
		 * @returns list of MatchCollection objects.
		 */
		getMatchCollectionById: (state) => {
			return (id: number): MatchCollection | null => {
				const matchCollection = state.matchCollections.find((collection) => collection.id === id)
				return matchCollection || null
			}
		},
	},
	actions: {
		/**
		 * Initializes the match store by loading match collections from local storage.
		 * This should be called when the application starts to restore previous state.
		 */
		loadFromStorage() {
			const raw = localStorage.getItem(STORAGE_KEYS.MATCH_COLLECTION_LIST)
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as number[]
					this.$patch({
						matchCollectionIdList: parsed,
					})
					for (const id of this.matchCollectionIdList) {
						const collectionRaw = localStorage.getItem(STORAGE_KEYS.MATCH_COLLECTION_PREFIX + id)
						if (collectionRaw) {
							try {
								const collection = JSON.parse(collectionRaw) as MatchCollection
								this.matchCollections.push(collection)
							} catch (error) {
								console.error(`Failed to parse match collection with id ${id}:`, error)
							}
						} else {
							console.warn(`No match collection found for id ${id}`)
						}
					}
				} catch (error) {
					console.error('Failed to parse matches from storage:', error)
					this.matchCollectionIdList = []
					this.matchCollections = []
				}
			} else {
				this.matchCollectionIdList = []
				this.matchCollections = []
			}
		},
		/**
		 * Saves the current state of match collections to local storage.
		 * This should be called whenever a match collection is added, updated, or deleted.
		 */
		saveToStorage() {
			this.saveMatchCollectionListToStorage()
			for (const collection of this.matchCollections) {
				this.saveMatchCollectionToStorage(collection)
			}
		},
		/**
		 * Saves the list of match collection IDs to local storage.
		 * This is used to keep track of all match collections available in the store.
		 */
		saveMatchCollectionListToStorage() {
			localStorage.setItem(
				STORAGE_KEYS.MATCH_COLLECTION_LIST,
				JSON.stringify(this.matchCollectionIdList),
			)
		},
		/**
		 * Saves a specific match collection to local storage.
		 * This is used to persist the state of a match collection.
		 * @param collection : MatchCollection - The match collection to save.
		 */
		saveMatchCollectionToStorage(collection: MatchCollection) {
			if (!this.matchCollectionIdList.includes(collection.id)) {
				console.warn(`Match collection with id ${collection.id} does not exist.`)
				return
			}
			localStorage.setItem(STORAGE_KEYS.MATCH_COLLECTION_PREFIX + collection.id, JSON.stringify(collection))
		},
		/**
		 * Adds a new match collection to the store and saves it to local storage.
		 * This is used to create a new match collection.
		 * @param collection : MatchCollection - The match collection to add.
		 */
		addMatchCollection(collection: MatchCollection) {
			if (this.matchCollectionIdList.includes(collection.id)) {
				console.warn(`Match collection with id ${collection.id} already exists.`)
				return
			}
			this.matchCollectionIdList.push(collection.id)
			this.matchCollections.push(collection)
			this.saveToStorage()
		},
		/**
		 * Updates an existing match collection in the store and saves it to local storage.
		 * This is used to modify an existing match collection (e.g., adding a new match).
		 * @param collection : MatchCollection - The updated match collection.
		 */
		updateMatchCollection(collection: MatchCollection) {
			const index = this.matchCollections.findIndex(c => c.id === collection.id)
			if (index === -1) {
				console.warn(`Match collection with id ${collection.id} does not exist.`)
				return
			}
			this.matchCollections[index] = collection
			this.saveToStorage()
		},
		/**
		 * Retrieves a match collection by its ID.
		 * @param id : number - The ID of the match collection to retrieve.
		 * @returns MatchCollection | undefined - The match collection if found, otherwise undefined.
		 */
		deleteMatchCollection(id: number) {
			const index = this.matchCollectionIdList.indexOf(id)
			if (index === -1) {
				console.warn(`Match collection with id ${id} does not exist.`)
				return
			}
			this.matchCollectionIdList.splice(index, 1)
			this.matchCollections = this.matchCollections.filter((collection) => collection.id !== id)
			localStorage.removeItem(STORAGE_KEYS.MATCH_COLLECTION_PREFIX + id)
			this.saveMatchCollectionListToStorage()
		},
		/**
		 * Deletes a match from a specific match collection.
		 *
		 * @param matchId : number - The ID of the match to delete.
		 * @param collectionId : number - The ID of the match collection from which to delete the match.
		 */
		deleteMatch(matchId: number, collectionId: number) {
			const collection = this.getMatchCollectionById(collectionId)
			if (!collection) {
				console.warn(`Match collection with id ${collectionId} does not exist.`)
				return
			}
			const matchIndex = collection.matches.findIndex((match) => match.id === matchId)
			if (matchIndex === -1) {
				console.warn(`Match with id ${matchId} does not exist in collection ${collectionId}.`)
				return
			}
			collection.matches.splice(matchIndex, 1)
			this.saveMatchCollectionToStorage(collection)
		},
		/**
		 * Updates an existing match in a specific match collection.
		 *
		 * @param collectionId : number - The ID of the match collection containing the match to update.
		 * @param match : Match | RankedMatch - The updated match object.
		 */
		updateMatch(collectionId: number, match: Match | RankedMatch) {
			const collection = this.getMatchCollectionById(collectionId)
			if (!collection) {
				console.warn(`Match collection with id ${collectionId} does not exist.`)
				return
			}
			const matchIndex = collection.matches.findIndex((m) => m.id === match.id)
			if (matchIndex === -1) {
				console.warn(`Match with id ${match.id} does not exist in collection ${collectionId}.`)
				return
			}
			collection.matches[matchIndex] = match
			this.saveMatchCollectionToStorage(collection)
		},
		/**
		 * Adds a match to a specific match collection.
		 *
		 * @param collectionId : number - The ID of the match collection to which the match will be added.
		 * @param match : Match | RankedMatch - The match object to add.
		 */
		addMatchToCollection(collectionId: number, match: Match | RankedMatch) {
			const collection = this.getMatchCollectionById(collectionId)
			if (!collection) {
				console.warn(`Match collection with id ${collectionId} does not exist.`)
				return
			}
			if (collection.matches.some((m) => m.id === match.id)) {
				console.warn(`Match with id ${match.id} already exists in collection ${collectionId}.`)
				return
			}
			collection.matches.push(match)
			this.saveMatchCollectionToStorage(collection)
		},
		resetStore() {
			this.matchCollectionIdList = []
			localStorage.removeItem(STORAGE_KEYS.MATCH_COLLECTION_LIST)
			this.matchCollections.forEach((collection: MatchCollection) =>
				localStorage.removeItem(STORAGE_KEYS.MATCH_COLLECTION_PREFIX + collection.id),
			)
			this.matchCollections = []
		},
	},
})
