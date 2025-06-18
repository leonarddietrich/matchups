/**
 * This file contains constants for the Rivals of Aether 2 game.
 * It includes lists of characters (Rivals) and stages, each with their respective properties.
 */

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

/**
 * List of characters with their elements and icon paths.
 * The icon paths are relative to the `public` directory.
 */
export const RIVALS: Rival[] = [
	{
		name: 'Zetterburn',
		element: 'Fire',
		iconPath: '/src/assets/roa2/characters/RoA2_Zetterburn_Portrait.png',
		color: '#FFD700',
	},
	{
		name: 'Orcane',
		element: 'Water',
		iconPath: '/src/assets/roa2/characters/RoA2_Orcane_Portrait.png',
		color: '#FF1493',
	},
	{
		name: 'Wrastor',
		element: 'Air',
		iconPath: '/src/assets/roa2/characters/RoA2_Wrastor_Portrait.png',
		color: '#00FFFF',
	},
	{
		name: 'Kragg',
		element: 'Earth',
		iconPath: '/src/assets/roa2/characters/RoA2_Kragg_Portrait.png',
		color: '#0000FF',
	},
	{
		name: 'Forsburn',
		element: 'Fire',
		iconPath: '/src/assets/roa2/characters/RoA2_Forsburn_Portrait.png',
		color: '#008000',
	},
	{
		name: 'Maypul',
		element: 'Earth',
		iconPath: '/src/assets/roa2/characters/RoA2_Maypul_Portrait.png',
		color: '#EE82EE',
	},
	{
		name: 'Absa',
		element: 'Air',
		iconPath: '/src/assets/roa2/characters/RoA2_Absa_Portrait.png',
		color: '#B0E0E6',
	},
	{
		name: 'Etalus',
		element: 'Water',
		iconPath: '/src/assets/roa2/characters/RoA2_Etalus_Portrait.png',
		color: '#FFA500',
	},
	{
		name: 'Ranno',
		element: 'Water',
		iconPath: '/src/assets/roa2/characters/RoA2_Ranno_Portrait.png',
		color: '#FF4500',
	},
	{
		name: 'Clairen',
		element: 'Fire',
		iconPath: '/src/assets/roa2/characters/RoA2_Clairen_Portrait.png',
		color: '#FF0000',
	},
	{
		name: 'Sylvanos',
		element: 'Earth',
		iconPath: '/src/assets/roa2/characters/RoA2_Sylvanos_Portrait.png',
		color: '#228B22',
	},
	{
		name: 'Elliana',
		element: 'Air',
		iconPath: '/src/assets/roa2/characters/RoA2_Elliana_Portrait.png',
		color: '#B0E0E6',
	},
	{
		name: 'Mollo',
		element: 'Fire',
		iconPath: '/src/assets/roa2/characters/RoA2_Mollo_Portrait.png',
		color: '#A0522D',
	},
	{
		name: 'Hodan',
		element: 'Earth',
		iconPath: '/src/assets/roa2/characters/RoA2_Hodan_Portrait.png',
		color: '#8B4513',
	},
	{
		name: 'Pomme',
		element: 'Air',
		iconPath: '/src/assets/roa2/characters/RoA2_Pomme_Portrait.png',
		color: '#FF69B4',
	},
	{
		name: 'Olympia',
		element: 'Water',
		iconPath: '/src/assets/roa2/characters/RoA2_Olympia_Portrait.png',
		color: '#FF00FF',
	},
	{
		name: 'Loxodont',
		element: 'Earth',
		iconPath: '/src/assets/roa2/characters/RoA2_Loxodont_Portrait.png',
		color: '#4B0082',
	},
	{
		name: 'Fleet',
		element: 'Air',
		iconPath: '/src/assets/roa2/characters/RoA2_Fleet_Portrait.png',
		color: '#FFFF00',
	},
	{
		name: 'La Reina',
		element: 'Fire',
		iconPath: '/src/assets/roa2/characters/RoA2_La_Reina_Portrait.png',
		color: '#C71585',
	},
]

/**
 * List of stages with their icon paths.
 * The icon paths are relative to the `public` directory.
 */
export const STAGES: Stage[] = [
	{
		name: 'Aetherian Forest',
		iconPath: '/src/assets/roa2/stages/AetherianForest.png',
	},
	{
		name: 'Godai Delta',
		iconPath: '/src/assets/roa2/stages/GodaiDelta.png',
	},
	{
		name: 'Hodojo',
		iconPath: '/src/assets/roa2/stages/Hodojo.png',
	},
	{
		name: 'Julesvale',
		iconPath: '/src/assets/roa2/stages/Julesvale.png',
	},
	{
		name: 'Merchant Port',
		iconPath: '/src/assets/roa2/stages/MerchantPort.png',
	},
	{
		name: 'Air Armada',
		iconPath: '/src/assets/roa2/stages/AirArmada.png',
	},
	{
		name: 'Fire Capital',
		iconPath: '/src/assets/roa2/stages/FireCapital.png',
	},
	{
		name: 'Hyperborean Harbor',
		iconPath: '/src/assets/roa2/stages/HyperboreanHarbor.png',
	},
	{
		name: 'Rock Wall',
		iconPath: '/src/assets/roa2/stages/RockWall.png',
	},
	{
		name: 'Tempest Peak',
		iconPath: '/src/assets/roa2/stages/TempestPeak.png',
	},
	{
		name: 'Forest Understory',
		iconPath: '/src/assets/roa2/stages/ForestUnderstory.png',
	},
	{
		name: 'Stormswept Pillar',
		iconPath: '/src/assets/roa2/stages/StormsweptPillar.png',
	},
]

/**
 * Retrieves a rival by their name.
 *
 * @param name - The name of the rival to search for.
 * @returns {Rival | undefined} - The rival object if found, otherwise undefined.
 */
export function getRivalByName(name: string): Rival | undefined {
	const rivalName = name as RivalName
	const rival: Rival | undefined = RIVALS.find((rival) => rival.name === rivalName)
	if (!rival) {
		console.error(`Invalid rival name: "${name}"`)
	}
	return rival
}

/**
 * Retrieves the icon path for a rival.
 *
 * @param rival - The rival object.
 * @returns {string} - The path to the rival's icon image, or an empty string if the rival is undefined.
 */
export function getRivalIconPath(rival: Rival): string {
	return rival ? rival.iconPath : ''
}

/**
 * Retrieves the icon path for a rival by their name.
 *
 * @param name - The name of the rival.
 * @returns {string} - The path to the rival's icon image, or an empty string if not found.
 */
export function getRivalIconPathByName(name: string): string {
	const rival = getRivalByName(name)
	return rival ? getRivalIconPath(rival) : ''
}

/**
 * Retrieves a stage by its name.
 *
 * @param name - The name of the stage to search for.
 * @returns {Stage | undefined} - The stage object if found, otherwise undefined.
 */
export function getStageByName(stageName: StageName): Stage | undefined {
	const stage: Stage | undefined = STAGES.find((stage) => stage.name === stageName)
	if (!stage) {
		console.error(`Invalid stage name: "${name}"`)
	}
	return stage
}

/**
 * Retrieves the icon path for a stage.
 *
 * @param stage - The stage object.
 * @returns {string} - The path to the stage's icon image, or an empty string if the stage is undefined.
 */
export function getStageIconPath(stage: Stage): string {
	return stage ? stage.iconPath : ''
}

/**
 * Retrieves the icon path for a stage by its name.
 *
 * @param name - The name of the stage.
 * @returns {string} - The path to the stage's icon image, or an empty string if not found.
 */
export function getStageIconPathByName(stageName: StageName): string {
	const stage = getStageByName(stageName)
	return stage ? getStageIconPath(stage) : ''
}
