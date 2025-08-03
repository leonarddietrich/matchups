/**
 * Local Storage Keys
 * Centralized constants for localStorage keys to avoid typos and maintain consistency
 */

export const LOCAL_STORAGE_KEYS = {
	MATCH_COLLECTION_PREFIX: 'roa2-match-collection-',
} as const;

export const SESSION_STORAGE_KEYS = {
  ACTIVE_MATCH_COLLECTION: 'roa2-active-match-collection',
  MATCH_FILTERS: 'roa2-match-filters',
} as const;

