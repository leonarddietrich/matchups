import { defineStore } from 'pinia'
import type { AnyMatchCollection, Match, RankedMatch } from '../types/roa2Types'
import { LOCAL_STORAGE_KEYS } from '@/constants'
import { CURRENT_MATCH_DATA_VERSION } from '@/constants/match'
import { transformMatchCollectionWithOutdatedVersion } from '@/scripts/roa2'

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
			console.info('Loading match collections from local storage...')
			deleteOldData()

			this.matchCollections = []
			const localStorageKeys = Object.keys(localStorage).filter(key => key.startsWith(LOCAL_STORAGE_KEYS.MATCH_COLLECTION_PREFIX))

			for (const key of localStorageKeys) {
				const value = localStorage.getItem(key)
				if (key && value) {
					try {
						const collection = JSON.parse(value) as AnyMatchCollection
						if (!isPlainObject(collection)) {
							console.warn(`Match collection with key ${key} is not an object and will be skipped. value: ${value}`)
							continue
						}
						if (!collection.hasOwnProperty('version') || collection.version < CURRENT_MATCH_DATA_VERSION) {
							transformCollectionToLatestVersion(collection, key)
						}
						this.matchCollections.push(collection as AnyMatchCollection)
					} catch (error) {
						console.error(`Failed to parse match collection from localStorage with key ${key}:`, error)
					}
				}
			}
			console.info('Loaded match collections:', this.matchCollections)
		},
		/**
		 * Saves the current state of match collections to local storage.
		 * This should be called whenever a match collection is added, updated, or deleted.
		 */
		saveToStorage() {
			for (const collection of this.matchCollections) {
				this.saveMatchCollectionToStorage(collection)
			}
		},
		/**
		 * Saves a specific match collection to local storage.
		 * This is used to persist the state of a match collection.
		 * @param collection : AnyMatchCollection - The match collection to save.
		 */
		saveMatchCollectionToStorage(collection: AnyMatchCollection) {
			localStorage.setItem(LOCAL_STORAGE_KEYS.MATCH_COLLECTION_PREFIX + collection.uuid, JSON.stringify(collection))
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
			this.saveMatchCollectionToStorage(collection)
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
			localStorage.removeItem(LOCAL_STORAGE_KEYS.MATCH_COLLECTION_PREFIX + collection.uuid)
		},
		/**
		 * Deletes a match from a specific match collection.
		 *
		 * @param matchId : string - The uuid of the match to delete.
		 * @param collectionName : string - The name of the match collection from which to delete the match.
		 */
		deleteMatch(matchId: string, collectionName: string) {
			const collection = this.getMatchCollectionByName(collectionName)
			if (!collection) {
				console.warn(`Match collection with name ${collectionName} does not exist.`)
				return
			}
			const matchIndex = collection.matches.findIndex((match) => match.uuid === matchId)
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
			const matchIndex = collection.matches.findIndex((m: Match | RankedMatch) => m.uuid === match.uuid)
			if (matchIndex === -1) {
				console.warn(`Match with id ${match.uuid} does not exist in collection ${collectionName}.`)
				return
			}
			collection.matches[matchIndex] = match
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
			if (collection.matches.some((m: Match | RankedMatch) => m.uuid === match.uuid)) {
				console.warn(`Match with id ${match.uuid} already exists in collection ${collectionName}.`)
				return
			}
			if (collection.type === 'ranked') {
				// Only allow RankedMatch in ranked collections
				if ('playerElo' in match && 'opponentElo' in match) {
					(collection.matches as RankedMatch[]).push(match as RankedMatch)
				} else {
					console.warn('Trying to add a non-ranked match to a ranked collection.')
					return
				}
			} else {
				// Only allow Match in non-ranked collections
				if (!('playerElo' in match) && !('opponentElo' in match)) {
					(collection.matches as Match[]).push(match as Match)
				} else {
					console.warn('Trying to add a ranked match to a non-ranked collection.')
					return
				}
			}
			this.saveMatchCollectionToStorage(collection)
		},
		resetStore() {
			this.matchCollections = []
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i) || ''
				if (key.startsWith(LOCAL_STORAGE_KEYS.MATCH_COLLECTION_PREFIX)) {
					localStorage.removeItem(key)
				}
			}
		},
	},
})

function transformCollectionToLatestVersion(collection: AnyMatchCollection, key: string) {
	transformMatchCollectionWithOutdatedVersion(collection)

	const correctKey = LOCAL_STORAGE_KEYS.MATCH_COLLECTION_PREFIX + collection.uuid
	if (key !== correctKey) {
		localStorage.setItem(correctKey, JSON.stringify(collection))
		localStorage.removeItem(key)
	} else {
		localStorage.setItem(key, JSON.stringify(collection))
	}
}

function deleteOldData() {
	const localStorageKeys = Object.keys(localStorage).filter(key => key.startsWith(LOCAL_STORAGE_KEYS.MATCH_COLLECTION_PREFIX + "list"))
	localStorageKeys.forEach(key => localStorage.removeItem(key))
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' &&
		value !== null &&
		!Array.isArray(value);
}
