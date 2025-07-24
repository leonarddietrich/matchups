import type { MatchCollection, Match, Round } from '@/types/roa2Types'
import { RIVAL_NAMES, STAGE_NAMES } from '@/constants/roa2'


// Generate random opponent names
export const opponentNames: string[] = [
	'Alex Thunder', 'Maya Storm', 'Jake Lightning', 'Emma Frost', 'Liam Fire',
	'Sophie Wind', 'Noah Earth', 'Ava Water', 'Oliver Flame', 'Isabella Sky',
	'Ethan Rock', 'Mia Wave', 'Lucas Blaze', 'Charlotte Air', 'Mason Stone',
	'Amelia Rain', 'Logan Ember', 'Harper Gale', 'Benjamin Tide', 'Evelyn Dust',
	'Sebastian Spark', 'Abigail Mist', 'Henry Lava', 'Emily Breeze', 'Jackson Cliff',
	'Elizabeth Dew', 'Samuel Ash', 'Grace Storm', 'Owen Magma', 'Chloe Zephyr',
	'Luke Granite', 'Victoria Rain', 'Gabriel Fire', 'Zoey Thunder', 'Caleb Ocean',
	'Lily Blaze', 'Nathan Gust', 'Stella Earth', 'Isaac Flame', 'Ruby Cyclone',
	'Connor Stone', 'Hazel Torrent', 'Wyatt Ember', 'Scarlett Wind', 'Nolan Vapor',
	'Aria Lava', 'Carson Rock', 'Violet Storm', 'Easton Spark', 'Paisley Wave'
]

export function getRandomElement<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)]
}

export function generateRandomElo(): number {
	// Generate ELO between 800-2200 with normal distribution around 1200
	const min = 800
	const max = 2200
	const mean = 1200
	const stdDev = 300

	// Box-Muller transform for normal distribution
	const u1 = Math.random()
	const u2 = Math.random()
	const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)

	const elo = Math.round(mean + stdDev * z0)
	return Math.max(min, Math.min(max, elo))
}

export function generateMatch(id: number): Match {
	const opponentName = getRandomElement(opponentNames)
	const playerElo = generateRandomElo()
	const opponentElo = generateRandomElo()

	// Generate 1-3 rounds, with most matches having 3 rounds
	const roundCount = Math.random() < 0.1 ? 1 : Math.random() < 0.3 ? 2 : 3
	const rounds: Round[] = []

	let playerWins = 0
	let opponentWins = 0

	for (let i = 0; i < roundCount; i++) {
		const stage = getRandomElement(STAGE_NAMES)
		const playerRival = getRandomElement(RIVAL_NAMES)
		const opponentRival = getRandomElement(RIVAL_NAMES)

		// Determine winner ensuring max 2 wins for either side
		let won: boolean
		if (i === roundCount - 1) {
			// Last round: ensure someone wins the match
			if (playerWins === opponentWins) {
				won = Math.random() < 0.5 // Random winner if tied
			} else {
				won = playerWins < opponentWins // Losing player wins last round if behind
			}
		} else {
			// Not last round: ensure we don't exceed 2 wins
			if (playerWins >= 2) {
				won = false
			} else if (opponentWins >= 2) {
				won = true
			} else {
				won = Math.random() < 0.5
			}
		}

		if (won) {
			playerWins++
		} else {
			opponentWins++
		}

		rounds.push({
			stage,
			playerRival,
			opponentRival,
			won
		})
	}

	// Sometimes add links
	const links = Math.random() < 0.3 ? [
		{
			text: 'Match VOD',
			link: `https://example.com/match/${id}`
		}
	] : []

	return {
		id,
		opponentName,
		opponentElo,
		playerElo,
		rounds,
		links
	}
}

// Generate 50 example matches
export function generateExampleMatches(startId: number): Match[] {
	const matches: Match[] = []

	for (let i = 0; i < 50; i++) {
		matches.push(generateMatch(startId + i))
	}

	return matches
}

export function generateExampleCollectionData(collectionId: number, startMatchId: number): MatchCollection {
	return {
		id: collectionId,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		name: 'Example Match Collection',
		type: 'ranked',
		description: 'This is an example match collection with 50 sample matches featuring all characters and stages.',
		matches: generateExampleMatches(startMatchId),
	}
}

export const EXAMPLE_COLLECTION_NAME = 'Example Match Collection'
