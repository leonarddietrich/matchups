import type { Match, Round, MatchFilters } from '@/types/roa2Types'

/**
 * Checks if a round matches the given filter criteria
 */
export function roundMatchesFilters(round: Round, filters: MatchFilters): boolean {
	// Stage filter
	if (filters.stages && filters.stages.length > 0) {
		if (!filters.stages.includes(round.stage)) {
			return false
		}
	}

	// Player character filter
	if (filters.playerCharacter && filters.playerCharacter.length > 0) {
		if (!filters.playerCharacter.includes(round.playerRival)) {
			return false
		}
	}

	// Opponent character filter
	if (filters.opponentCharacter && filters.opponentCharacter.length > 0) {
		if (!filters.opponentCharacter.includes(round.opponentRival)) {
			return false
		}
	}

	// Results filter
	if (filters.results) {
		const wonRound = round.won
		if (filters.results === 'wins' && !wonRound) {
			return false
		}
		if (filters.results === 'losses' && wonRound) {
			return false
		}
	}

	return true
}

/**
 * Checks if a match meets the difficulty criteria
 */
export function matchMeetsDifficultyFilter(match: Match, difficulty?: string): boolean {
	if (!difficulty) return true

	const hasPlayerElo = match.playerElo !== undefined && match.playerElo !== null
	const hasOpponentElo = match.opponentElo !== undefined && match.opponentElo !== null

	// Unknown difficulty: show matches where player OR opponent has no ELO
	if (difficulty === 'unknown') {
		return !hasPlayerElo || !hasOpponentElo
	}

	// For other difficulties, both players must have ELO data
	if (!hasPlayerElo || !hasOpponentElo) {
		return false
	}

	const eloDifference = match.opponentElo - match.playerElo

	switch (difficulty) {
		case 'easy':
			return eloDifference < -200
		case 'equal':
			return Math.abs(eloDifference) <= 200
		case 'hard':
			return eloDifference > 200
		default:
			return true
	}
}

/**
 * Filters rounds within a match based on the given criteria
 */
export function filterRoundsInMatch(match: Match, filters: MatchFilters): Round[] {
	return match.rounds.filter(round => roundMatchesFilters(round, filters))
}

/**
 * Checks if a match should be displayed based on filters
 * A match is displayed if:
 * 1. It meets the difficulty criteria
 * 2. It has at least one round that matches the filter criteria
 */
export function matchShouldBeDisplayed(match: Match, filters: MatchFilters): boolean {
	// Check difficulty filter first
	if (!matchMeetsDifficultyFilter(match, filters.difficulty)) {
		return false
	}

	// Check if any round matches the filters
	const filteredRounds = filterRoundsInMatch(match, filters)
	return filteredRounds.length > 0
}

/**
 * Filters matches based on the given criteria
 */
export function filterMatches(matches: Match[], filters: MatchFilters): Match[] {
	return matches.filter(match => matchShouldBeDisplayed(match, filters))
}

/**
 * Creates a copy of a match with only the rounds that match the filter criteria
 */
export function createFilteredMatch(match: Match, filters: MatchFilters): Match | null {
	if (!matchShouldBeDisplayed(match, filters)) {
		return null
	}

	const filteredRounds = filterRoundsInMatch(match, filters)

	return {
		...match,
		rounds: filteredRounds
	}
}

/**
 * Filters an array of matches and returns copies with only matching rounds
 */
export function createFilteredMatches(matches: Match[], filters: MatchFilters): Match[] {
	return matches
		.map(match => createFilteredMatch(match, filters))
		.filter((match): match is Match => match !== null)
}
