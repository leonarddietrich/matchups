/**
 * Match Types
 */
export const MATCH_TYPES = ['ranked', 'casual', 'friendly', 'tournament'] as const;

/**
 * CSS Column Mapping for CSV Upload
 * Used in HeaderSelector component for mapping CSV headers to match properties
 */
export const CSV_MATCH_MAPPING = {
  id: 0,
  playerElo: 1,
  opponentElo: 2,
  opponentName: 3,
  stage: 4,
  playerRival: 5,
  opponentRival: 6,
  won: 7,
  links: 8,
} as const;

/**
 * Match Properties for CSV Upload
 * Used in HeaderSelector component
 */
export const MATCH_PROPERTIES = [
  'id',
  'playerElo',
  'opponentElo',
  'opponentName',
  'stage',
  'playerRival',
  'opponentRival',
  'won',
  'links',
] as const;

