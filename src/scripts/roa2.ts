/**
 * Rivals of Aether 2 Utilities
 */

import type { Rival, Stage, RivalName, StageName, Match,
	RankedMatch, AnyMatchCollection } from '@/types/roa2Types'
import { RIVALS, STAGES } from '@/constants/roa2';
import { CURRENT_MATCH_DATA_VERSION } from '@/constants/match';

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
		console.error(`Invalid stage name: "${stageName}"`)
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

export function transformMatchCollectionWithOutdatedVersion(collection: AnyMatchCollection) {
	const oldVersion = collection.hasOwnProperty('version') ? (collection as { version: number }).version : 0
		if (oldVersion < 1.0) {
			console.info(`Transforming match collection '${collection.name}' from version ${oldVersion} to ${CURRENT_MATCH_DATA_VERSION}`)
			console.info('Original collection:', {...collection})
			delete ((collection as unknown) as Record<string, unknown>).id
			collection.uuid = collection.uuid || crypto.randomUUID()
			collection.version = CURRENT_MATCH_DATA_VERSION
			transformMatchesToVersion1(collection.matches, collection.type === 'ranked')
			console.info('Transformed collection:', collection)
		}
}

function transformMatchesToVersion1(matches: (Match | RankedMatch)[], isRanked: boolean) {
	let timestampCounter = 0
	const baseTimestamp = Date.now()

	for (const match of matches) {
		if (!isRanked){
			if (match.hasOwnProperty('playerElo')) {
				delete ((match as unknown) as Record<string, unknown>).playerElo
			}
			if (match.hasOwnProperty('opponentElo')) {
				delete ((match as unknown) as Record<string, unknown>).opponentElo
			}
		}
		if (match.hasOwnProperty('id')){
			delete ((match as unknown) as Record<string, unknown>).id
		}
		if (!match.hasOwnProperty('uuid')) {
			match.uuid = crypto.randomUUID()
		}
		if (!match.hasOwnProperty('createdAt')) {
			// Create unique timestamps by incrementing by 1 second for each match
			const uniqueTimestamp = new Date(baseTimestamp + (timestampCounter * 1000))
			match.createdAt = uniqueTimestamp.toISOString()
			match.updatedAt = uniqueTimestamp.toISOString()
			timestampCounter++
		}
	}
}
