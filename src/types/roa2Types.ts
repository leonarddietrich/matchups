export type MatchType = 'ranked' | 'casual' | 'friendly' | 'tournament'
export type RivalElement = 'Fire' | 'Water' | 'Air' | 'Earth'
export type RivalName =
	| 'Zetterburn'
	| 'Orcane'
	| 'Wrastor'
	| 'Kragg'
	| 'Forsburn'
	| 'Maypul'
	| 'Absa'
	| 'Etalus'
	| 'Ranno'
	| 'Clairen'
	| 'Sylvanos'
	| 'Elliana'
	| 'Mollo'
	| 'Hodan'
	| 'Pomme'
	| 'Olympia'
	| 'Loxodont'
	| 'Fleet'
	| 'La Reina'
	| 'Galvan'

export type StageName =
	| 'Aetherian Forest'
	| 'Godai Delta'
	| 'Hodojo'
	| 'Julesvale'
	| 'Merchant Port'
	| 'Air Armada'
	| 'Fire Capital'
	| 'Hyperborean Harbor'
	| 'Rock Wall'
	| 'Tempest Peak'
	| 'Forest Understory'
	| 'Stormswept Pillar'

/**
 * Represents a character in Rivals of Aether 2.
 *
 * @property {string} name - The name of the character.
 * @property {string} element - The element associated with the character (e.g., Fire, Water, Air, Earth).
 * @property {string} icon - The path to the character's icon image, relative to the `assets` directory.
 */
export interface Rival {
	name: RivalName
	element: RivalElement
	iconPath: string
	color: string
}

/**
 * Represents a stage in Rivals of Aether 2.
 *
 * @property {string} name - The name of the stage.
 * @property {string} iconPathWebp - The path to the stage's icon image in WEBP format.
 * @property {string} iconPath - The path to the stage's icon image in PNG format.
 */
export interface Stage {
	name: StageName
	iconPathWebp: string
	iconPath: string
}

/**
 * Aggregated performance for a specific stage within a matchup (player vs opponent).
 */
export interface StagePerformance extends Stage {
	timesPlayed: number
	wins: number
	percentage: number | undefined
}

/**
 * Represents a round in a match in Rivals of Aether 2.
 *
 * @property {StageName} stage - The stage where the round was played.
 * @property {RivalName} playerRival - The character used by the player in this round.
 * @property {RivalName} opponentRival - The character used by the opponent in this round.
 * @property {boolean} won - Indicates whether the player won this round.
 */
export interface Round {
	stage: StageName
	playerRival: RivalName
	opponentRival: RivalName
	won: boolean
}

/**
 * Represents a match in Rivals of Aether 2.
 *
 * @property {string} uuid - Unique identifier for the match.
 * @property {string} createdAt - ISO date string for when the match was created.
 * @property {string} updatedAt - ISO date string for when the match was last updated.
 * @property {string} opponentName - Name of the opponent in the match.
 * @property {Round[]} rounds - Array of rounds played in the match.
 * @property {{ text: string; link: string }[]} links - Array of links related to the match (e.g., replays, stats).
 */
export interface Match {
	uuid: string
	createdAt: string
	updatedAt: string
	opponentName: string
	rounds: Round[]
	links: { text: string; link: string }[]
}

/**
 * Represents a ranked match in Rivals of Aether 2.
 * @extends Match
 * @property {number} playerElo - The player's Elo rating at the time of the match.
 * @property {number} opponentElo - The opponent's Elo rating at the time of the match.
 */
export interface RankedMatch extends Match {
	playerElo: number
	opponentElo: number
}

/**
 * Represents a collection of matches in Rivals of Aether 2.
 *
 * @property {string} createdAt - ISO date string for when the collection was created.
 * @property {string} updatedAt - ISO date string for when the collection was last updated.
 * @property {string} name - The name of the match collection.
 * @property {MatchType} type - The type of matches in the collection (e.g., ranked, casual).
 * @property {string} description - A description of the match collection.
 * @property {Match[]} matches - An array of matches in the collection.
 */
export interface MatchCollection {
	version: number
	uuid: string
	createdAt: string
	updatedAt: string
	name: string
	type: MatchType
	description: string
	matches: Match[]
}

/**
 * Represents a ranked match collection in Rivals of Aether 2.
 * @extends MatchCollection
 * @property {string} type - The type of the match collection, which is 'ranked'.
 * @property {RankedMatch[]} matches - An array of ranked matches in the collection.
 */
export interface RankedMatchCollection extends Omit<MatchCollection, 'type' | 'matches'> {
	type: 'ranked'
	matches: RankedMatch[]
}

export type AnyMatchCollection = MatchCollection | RankedMatchCollection

export type MatchResult = 'wins' | 'losses'
export type DifficultyLevel = 'easy' | 'equal' | 'hard' | 'unknown'

/**
 * Represents filters that can be applied to match collections.
 * @property {StageName[]} [stages] - An array of stage names to filter matches by stage.
 * @property {RivalName[]} [playerCharacter] - An array of player character names to filter matches by player character.
 * @property {RivalName[]} [opponentCharacter] - An array of opponent character names to filter matches by opponent character.
 * @property {MatchResult} [results] - The result of the match to filter by (wins or losses).
 * @property {DifficultyLevel} [difficulty] - The difficulty level of the match to filter by.
 */
export interface MatchFilters {
	stages?: StageName[]
	playerCharacter?: RivalName[]
	opponentCharacter?: RivalName[]
	results?: MatchResult
	difficulty?: DifficultyLevel
}
