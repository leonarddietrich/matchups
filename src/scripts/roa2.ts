/**
 * Rivals of Aether 2 Utilities
 */

import type { Rival, Stage, RivalName, StageName } from '@/types/roa2Types';
import { RIVALS, STAGES } from '@/constants/roa2';

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
