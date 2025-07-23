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
 * @property {string} icon - The path to the stage's icon image, relative to the `assets` directory.
 */
export interface Stage {
	name: StageName
	iconPath: string
}

export interface Round {
	stage: StageName
	playerRival: RivalName
	opponentRival: RivalName
	won: boolean
}

export interface Match {
	id: number
	playerElo: number
	opponentElo: number
	opponentName: string
	rounds: Round[]
	links: { text: string; link: string }[]
}

export interface RankedMatch extends Match {
	playerElo: number
	opponentElo: number
}

export interface MatchCollection {
	id: number // Unique identifier for the match collection
	createdAt: string // ISO date string for when the collection was created
	updatedAt: string // ISO date string for when the collection was last updated
	name: string
	type: MatchType
	description: string
	matches: Match[] | RankedMatch[]
}
