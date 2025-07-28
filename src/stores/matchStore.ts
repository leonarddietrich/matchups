import { defineStore } from 'pinia'
import type { AnyMatchCollection, Match, RankedMatch } from '../types/roa2Types'
import { STORAGE_KEYS } from '@/constants'

export const useMatchStore = defineStore('matchStore', {
	state: () => ({
		matchCollections: [] as AnyMatchCollection[],
	}),
	getters: {
		/**
		 * Returns the list of match collection names.
		 * Computed from the actual match collections array.
		 * @returns list of strings.
		 */
		getMatchCollectionNameList: (state) => {
			return state.matchCollections.map(c => c.name)
		},
		/**
		 * Returns a match collection by name.
		 * @param name : string - The name of the match collection to retrieve.
		 * @returns MatchCollection or RankedMatchCollection object, or null if not found.
		 */
		getMatchCollectionByName: (state) => {
			return (name: string): AnyMatchCollection | null => {
				const matchCollection = state.matchCollections.find((collection) => collection.name === name)
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
					const collectionNames = JSON.parse(raw) as string[]

					for (const name of collectionNames) {
						const collectionRaw = localStorage.getItem(STORAGE_KEYS.MATCH_COLLECTION_PREFIX + name)
						if (collectionRaw) {
							try {
								const collection = JSON.parse(collectionRaw) as AnyMatchCollection
								this.matchCollections.push(collection)
							} catch (error) {
								console.error(`Failed to parse match collection with name ${name}:`, error)
							}
						} else {
							console.warn(`No match collection found for name ${name}`)
						}
					}
				} catch (error) {
					console.error('Failed to parse matches from storage:', error)
					this.matchCollections = []
				}
			} else {
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
		 * Saves the list of match collection names to local storage.
		 * This is used to keep track of all match collections available in the store.
		 */
		saveMatchCollectionListToStorage() {
			localStorage.setItem(
				STORAGE_KEYS.MATCH_COLLECTION_LIST,
				JSON.stringify(this.getMatchCollectionNameList),
			)
		},
		/**
		 * Saves a specific match collection to local storage.
		 * This is used to persist the state of a match collection.
		 * @param collection : AnyMatchCollection - The match collection to save.
		 */
		saveMatchCollectionToStorage(collection: AnyMatchCollection) {
			if (!this.getMatchCollectionNameList.includes(collection.name)) {
				console.warn(`Match collection with name ${collection.name} does not exist.`)
				return
			}
			localStorage.setItem(STORAGE_KEYS.MATCH_COLLECTION_PREFIX + collection.name, JSON.stringify(collection))
		},
		/**
		 * Adds a new match collection to the store and saves it to local storage.
		 * This is used to create a new match collection.
		 * @param collection : AnyMatchCollection - The match collection to add.
		 */
		addMatchCollection(collection: AnyMatchCollection) {
			// Check if collection already exists in the actual collections array (more reliable)
			const existingCollection = this.matchCollections.find(c => c.name === collection.name)
			if (existingCollection) {
				console.warn(`Match collection with name ${collection.name} already exists.`)
				return
			}

			this.matchCollections.push(collection)
			this.saveToStorage()
		},
		/**
		 * Updates an existing match collection in the store and saves it to local storage.
		 * This is used to modify an existing match collection (e.g., adding a new match).
		 * @param collection : AnyMatchCollection - The updated match collection.
		 */
		updateMatchCollection(collection: AnyMatchCollection) {
			const index = this.matchCollections.findIndex(c => c.name === collection.name)
			if (index === -1) {
				console.warn(`Match collection with name ${collection.name} does not exist.`)
				return
			}
			this.matchCollections[index] = collection
			this.saveToStorage()
		},
		/**
		 * Deletes a match collection by its name.
		 * @param name : string - The name of the match collection to delete.
		 */
		deleteMatchCollection(name: string) {
			// Check if collection exists in the actual collections array (more reliable)
			const collection = this.matchCollections.find(c => c.name === name)
			if (!collection) {
				console.warn(`Match collection with name ${name} does not exist.`)
				return
			}

			this.matchCollections = this.matchCollections.filter((collection) => collection.name !== name)
			localStorage.removeItem(STORAGE_KEYS.MATCH_COLLECTION_PREFIX + name)
			this.saveMatchCollectionListToStorage()
		},
		/**
		 * Deletes a match from a specific match collection.
		 *
		 * @param matchId : number - The ID of the match to delete.
		 * @param collectionName : string - The name of the match collection from which to delete the match.
		 */
		deleteMatch(matchId: number, collectionName: string) {
			const collection = this.getMatchCollectionByName(collectionName)
			if (!collection) {
				console.warn(`Match collection with name ${collectionName} does not exist.`)
				return
			}
			const matchIndex = collection.matches.findIndex((match) => match.id === matchId)
			if (matchIndex === -1) {
				console.warn(`Match with id ${matchId} does not exist in collection ${collectionName}.`)
				return
			}
			collection.matches.splice(matchIndex, 1)
			this.saveMatchCollectionToStorage(collection)
		},
		/**
		 * Updates an existing match in a specific match collection.
		 *
		 * @param collectionName : string - The name of the match collection containing the match to update.
		 * @param match : Match | RankedMatch - The updated match object.
		 */
		updateMatch(collectionName: string, match: Match | RankedMatch) {
			const collection = this.getMatchCollectionByName(collectionName)
			if (!collection) {
				console.warn(`Match collection with name ${collectionName} does not exist.`)
				return
			}
			const matchIndex = collection.matches.findIndex((m: Match | RankedMatch) => m.id === match.id)
			if (matchIndex === -1) {
				console.warn(`Match with id ${match.id} does not exist in collection ${collectionName}.`)
				return
			}
			;(collection.matches as (Match | RankedMatch)[])[matchIndex] = match
			this.saveMatchCollectionToStorage(collection)
		},
		/**
		 * Adds a match to a specific match collection.
		 *
		 * @param collectionName : string - The name of the match collection to which the match will be added.
		 * @param match : Match | RankedMatch - The match object to add.
		 */
		addMatchToCollection(collectionName: string, match: Match | RankedMatch) {
			const collection = this.getMatchCollectionByName(collectionName)
			if (!collection) {
				console.warn(`Match collection with name ${collectionName} does not exist.`)
				return
			}
			if (collection.matches.some((m: Match | RankedMatch) => m.id === match.id)) {
				console.warn(`Match with id ${match.id} already exists in collection ${collectionName}.`)
				return
			}
			;(collection.matches as (Match | RankedMatch)[]).push(match)
			this.saveMatchCollectionToStorage(collection)
		},
		resetStore() {
			localStorage.removeItem(STORAGE_KEYS.MATCH_COLLECTION_LIST)
			this.matchCollections.forEach((collection: AnyMatchCollection) =>
				localStorage.removeItem(STORAGE_KEYS.MATCH_COLLECTION_PREFIX + collection.name),
			)
			this.matchCollections = []
		},
	},
})
