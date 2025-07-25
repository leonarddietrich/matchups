import type { MatchCollection } from '@/types/roa2Types'

export function generateExampleCollectionData(collectionId: number): MatchCollection {
	return {
		id: collectionId,
		createdAt: "2025-07-23T19:48:40.330Z",
		updatedAt: "2025-07-25T16:47:40.987Z",
		name: "Example Ranked Collection",
		type: "ranked",
		description: "Real ranked matches collection demonstrating the matchup tracking system",
		matches: [
			{
				id: 1,
				playerElo: 666,
				opponentElo: 849,
				opponentName: "Whalekitty",
				rounds: [
					{
						stage: "Julesvale",
						playerRival: "Orcane",
						opponentRival: "Clairen",
						won: false
					},
					{
						stage: "Fire Capital",
						playerRival: "Orcane",
						opponentRival: "Orcane",
						won: false
					}
				],
				links: [
					{
						text: "vod",
						link: "https://youtu.be/xCBwkKSn9xk"
					}
				]
			},
			{
				id: 2,
				playerElo: 660,
				opponentElo: 928,
				opponentName: "grogfunk",
				rounds: [
					{
						stage: "Godai Delta",
						playerRival: "Orcane",
						opponentRival: "Clairen",
						won: false
					},
					{
						stage: "Hyperborean Harbor",
						playerRival: "Orcane",
						opponentRival: "Clairen",
						won: true
					},
					{
						stage: "Julesvale",
						playerRival: "Orcane",
						opponentRival: "Clairen",
						won: false
					}
				],
				links: [
					{
						text: "vod",
						link: "https://youtu.be/wU8zyUQ8Oak"
					}
				]
			},
			{
				id: 3,
				playerElo: 656,
				opponentElo: -1,
				opponentName: "alph_58",
				rounds: [
					{
						stage: "Godai Delta",
						playerRival: "Orcane",
						opponentRival: "Clairen",
						won: true
					},
					{
						stage: "Fire Capital",
						playerRival: "Orcane",
						opponentRival: "Clairen",
						won: true
					}
				],
				links: [
					{
						text: "vod",
						link: "https://youtu.be/fJoFL4ZeR5k"
					}
				]
			},
			{
				id: 4,
				playerElo: 668,
				opponentElo: 656,
				opponentName: "AlEmerich",
				rounds: [
					{
						stage: "Godai Delta",
						playerRival: "Orcane",
						opponentRival: "Ranno",
						won: false
					},
					{
						stage: "Fire Capital",
						playerRival: "Orcane",
						opponentRival: "Ranno",
						won: true
					},
					{
						stage: "Rock Wall",
						playerRival: "Orcane",
						opponentRival: "Ranno",
						won: true
					}
				],
				links: [
					{
						text: "vod",
						link: "https://youtu.be/o_zbHWRqda4"
					}
				]
			},
			{
				id: 5,
				playerElo: 680,
				opponentElo: 645,
				opponentName: "AlEmerich",
				rounds: [
					{
						stage: "Godai Delta",
						playerRival: "Orcane",
						opponentRival: "Ranno",
						won: true
					}
				],
				links: [
					{
						text: "vod",
						link: "https://youtu.be/AF2tVG5iq7s"
					}
				]
			},
			{
				id: 6,
				playerElo: 691,
				opponentElo: 933,
				opponentName: "Chaler",
				rounds: [
					{
						stage: "Godai Delta",
						playerRival: "Orcane",
						opponentRival: "Maypul",
						won: false
					},
					{
						stage: "Merchant Port",
						playerRival: "Orcane",
						opponentRival: "Maypul",
						won: false
					}
				],
				links: [
					{
						text: "vod",
						link: "https://youtu.be/RfX1AcJ1QJY"
					}
				]
			},
			{
				id: 7,
				playerElo: 695,
				opponentElo: 886,
				opponentName: "LA-Z Rider",
				rounds: [
					{
						stage: "Godai Delta",
						playerRival: "Orcane",
						opponentRival: "Ranno",
						won: false
					},
					{
						stage: "Merchant Port",
						playerRival: "Orcane",
						opponentRival: "Ranno",
						won: false
					}
				],
				links: [
					{
						text: "vod",
						link: "https://youtu.be/gyUt99ilwhU"
					}
				]
			},
			{
				id: 8,
				playerElo: 689,
				opponentElo: 497,
				opponentName: "Ezementyl",
				rounds: [
					{
						stage: "Godai Delta",
						playerRival: "Orcane",
						opponentRival: "Clairen",
						won: true
					},
					{
						stage: "Julesvale",
						playerRival: "Orcane",
						opponentRival: "Ranno",
						won: true
					}
				],
				links: [
					{
						text: "vod",
						link: "https://youtu.be/trMTiRBJ1pQ"
					}
				]
			},
			{
				id: 9,
				playerElo: 695,
				opponentElo: 1076,
				opponentName: "bkdorumon",
				rounds: [
					{
						stage: "Godai Delta",
						playerRival: "Orcane",
						opponentRival: "Kragg",
						won: false
					},
					{
						stage: "Hyperborean Harbor",
						playerRival: "Orcane",
						opponentRival: "Kragg",
						won: false
					}
				],
				links: [
					{
						text: "vod",
						link: "https://youtu.be/UTqxSIE_gFU"
					}
				]
			},
			{
				id: 10,
				playerElo: 693,
				opponentElo: 680,
				opponentName: "Pog",
				rounds: [
					{
						stage: "Aetherian Forest",
						playerRival: "Orcane",
						opponentRival: "Ranno",
						won: true
					},
					{
						stage: "Julesvale",
						playerRival: "Orcane",
						opponentRival: "Ranno",
						won: false
					},
					{
						stage: "Hyperborean Harbor",
						playerRival: "Orcane",
						opponentRival: "Ranno",
						won: true
					}
				],
				links: [
					{
						text: "vod",
						link: "https://youtu.be/vqLSWq4gfQc"
					}
				]
			}
		]
	}
}

export const EXAMPLE_COLLECTION_NAME = 'Example Ranked Collection'
