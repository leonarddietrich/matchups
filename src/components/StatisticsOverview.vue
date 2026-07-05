<template>
	<div class="charts">
		<div class="chart">
			<h1>Character Played</h1>
			<canvas ref="playerCharacterCanvas"></canvas>
		</div>
		<div class="chart">
			<h1>Enemy Played</h1>
			<canvas ref="enemyCharacterCanvas"></canvas>
		</div>
	</div>

	<div class="matchups">
		<div class="matchup-column">
			<h2>Best Matchups</h2>
			<div v-if="bestMatchups.length === 0" class="matchup-empty">No matchups yet</div>
			<div
				v-for="cluster in bestMatchups"
				:key="`best-${cluster.winrate}`"
				class="matchup-row"
			>
				<div class="matchup-pairs">
					<div
						v-for="matchup in cluster.matchups"
						:key="`${matchup.player.name}-${matchup.opponent.name}`"
						class="matchup-pair"
					>
						<img class="matchup-icon" :src="matchup.player.iconPath" :alt="matchup.player.name" />
						<img
							class="matchup-icon opponent"
							:src="matchup.opponent.iconPath"
							:alt="matchup.opponent.name"
						/>
					</div>
				</div>
				<span class="matchup-winrate" :style="{ color: getWinrateColor(cluster.winrate) }">
					{{ formatWinrate(cluster.winrate) }}
				</span>
			</div>
		</div>

		<div class="matchup-column">
			<h2>Worst Matchups</h2>
			<div v-if="worstMatchups.length === 0" class="matchup-empty">No matchups yet</div>
			<div
				v-for="cluster in worstMatchups"
				:key="`worst-${cluster.winrate}`"
				class="matchup-row"
			>
				<div class="matchup-pairs">
					<div
						v-for="matchup in cluster.matchups"
						:key="`${matchup.player.name}-${matchup.opponent.name}`"
						class="matchup-pair"
					>
						<img class="matchup-icon" :src="matchup.player.iconPath" :alt="matchup.player.name" />
						<img
							class="matchup-icon opponent"
							:src="matchup.opponent.iconPath"
							:alt="matchup.opponent.name"
						/>
					</div>
				</div>
				<span class="matchup-winrate" :style="{ color: getWinrateColor(cluster.winrate) }">
					{{ formatWinrate(cluster.winrate) }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { Chart, type ChartConfiguration, registerables } from 'chart.js';
import { useMatchStore } from '@/stores/matchStore';
import { RIVALS } from '@/constants';
import type { Rival, RivalName } from '@/types/roa2Types';
import { getWinrateColor } from '@/scripts/utils';

Chart.register(...registerables);

const matchStore = useMatchStore();

const RIVAL_BY_NAME = new Map<RivalName, Rival>(RIVALS.map((rival) => [rival.name, rival]));

interface CharacterDistribution {
	labels: string[];
	data: number[];
	colors: string[];
}

/**
 * Represents an aggregated matchup (a player character against an opponent
 * character) with the winrate computed over every round played.
 */
interface MatchupStat {
	player: Rival;
	opponent: Rival;
	played: number;
	winrate: number;
}

/**
 * A group of matchups that all share the exact same winrate.
 */
interface MatchupCluster {
	winrate: number;
	matchups: MatchupStat[];
}

/**
 * Counts how many rounds each character appeared in across every match in every
 * collection, keyed by the given round property (the player or the opponent).
 */
function buildDistribution(side: 'playerRival' | 'opponentRival'): CharacterDistribution {
	const counts = new Map<RivalName, number>();

	for (const collection of matchStore.getAllMatchCollections) {
		for (const match of collection.matches) {
			for (const round of match.rounds) {
				const rival = round[side];
				counts.set(rival, (counts.get(rival) ?? 0) + 1);
			}
		}
	}

	const labels: string[] = [];
	const data: number[] = [];
	const colors: string[] = [];

	// Iterate RIVALS to keep a stable order and pull each character's color.
	for (const rival of RIVALS) {
		const count = counts.get(rival.name) ?? 0;
		if (count === 0) continue;
		labels.push(rival.name);
		data.push(count);
		colors.push(rival.color);
	}

	return { labels, data, colors };
}

const playerDistribution = computed(() => buildDistribution('playerRival'));
const enemyDistribution = computed(() => buildDistribution('opponentRival'));

/**
 * Total number of rounds the player played with each of their characters,
 * used to order matchups by the player's most-played characters.
 */
const playerCharacterUsage = computed<Map<RivalName, number>>(() => {
	const counts = new Map<RivalName, number>();
	for (const collection of matchStore.getAllMatchCollections) {
		for (const match of collection.matches) {
			for (const round of match.rounds) {
				counts.set(round.playerRival, (counts.get(round.playerRival) ?? 0) + 1);
			}
		}
	}
	return counts;
});

/**
 * Aggregates every round into player-vs-opponent matchups and computes the
 * winrate for each, sorted from best to worst.
 */
const matchupStats = computed<MatchupStat[]>(() => {
	const grouped = new Map<string, { player: Rival; opponent: Rival; wins: number; played: number }>();

	for (const collection of matchStore.getAllMatchCollections) {
		for (const match of collection.matches) {
			for (const round of match.rounds) {
				const player = RIVAL_BY_NAME.get(round.playerRival);
				const opponent = RIVAL_BY_NAME.get(round.opponentRival);
				if (!player || !opponent) continue;

				const key = `${player.name}__${opponent.name}`;
				const agg = grouped.get(key) ?? { player, opponent, wins: 0, played: 0 };
				agg.played += 1;
				if (round.won) agg.wins += 1;
				grouped.set(key, agg);
			}
		}
	}

	return Array.from(grouped.values())
		.map((agg) => ({
			player: agg.player,
			opponent: agg.opponent,
			played: agg.played,
			winrate: agg.wins / agg.played,
		}))
		// Best winrate first; break ties by the matchup played more often.
		.sort((a, b) => b.winrate - a.winrate || b.played - a.played);
});

/**
 * Groups matchups that share the exact same winrate into clusters, ordered from
 * the highest winrate to the lowest.
 */
const matchupClusters = computed<MatchupCluster[]>(() => {
	const clusters: MatchupCluster[] = [];
	let current: MatchupCluster | null = null;

	// matchupStats is already sorted by winrate (descending).
	for (const matchup of matchupStats.value) {
		if (!current || current.winrate !== matchup.winrate) {
			current = { winrate: matchup.winrate, matchups: [] };
			clusters.push(current);
		}
		current.matchups.push(matchup);
	}

	// Within each winrate cluster, order by the player's most-played character
	// first, then by how often the specific matchup occurred.
	const usage = playerCharacterUsage.value;
	for (const cluster of clusters) {
		cluster.matchups.sort(
			(a, b) =>
				(usage.get(b.player.name) ?? 0) - (usage.get(a.player.name) ?? 0) ||
				b.played - a.played,
		);
	}

	return clusters;
});

const bestMatchups = computed(() => matchupClusters.value.slice(0, 3));
const worstMatchups = computed(() =>
	// Take the 3 lowest winrate clusters and show them worst-first.
	matchupClusters.value.slice(-3).reverse(),
);

function formatWinrate(winrate: number): string {
	return `${Math.round(winrate * 100)}%`;
}

function toConfig(distribution: CharacterDistribution): ChartConfiguration<'doughnut'> {
	return {
		type: 'doughnut',
		data: {
			labels: distribution.labels,
			datasets: [
				{
					label: 'Rounds played',
					data: distribution.data,
					backgroundColor: distribution.colors,
					borderColor: 'rgba(0, 0, 0, 0)',
					hoverOffset: 4,
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: { display: false },
			},
		},
	};
}

const playerCharacterCanvas = ref<HTMLCanvasElement | null>(null);
let playerCharacterChart: Chart<'doughnut'> | null = null;

const enemyCharacterCanvas = ref<HTMLCanvasElement | null>(null);
let enemyCharacterChart: Chart<'doughnut'> | null = null;

onMounted(() => {
	if (playerCharacterCanvas.value) {
		playerCharacterChart = new Chart(playerCharacterCanvas.value, toConfig(playerDistribution.value));
	}
	if (enemyCharacterCanvas.value) {
		enemyCharacterChart = new Chart(enemyCharacterCanvas.value, toConfig(enemyDistribution.value));
	}
});

watch(playerDistribution, (distribution) => {
	if (!playerCharacterChart) return;
	playerCharacterChart.data.labels = distribution.labels;
	playerCharacterChart.data.datasets[0].data = distribution.data;
	playerCharacterChart.data.datasets[0].backgroundColor = distribution.colors;
	playerCharacterChart.update();
});

watch(enemyDistribution, (distribution) => {
	if (!enemyCharacterChart) return;
	enemyCharacterChart.data.labels = distribution.labels;
	enemyCharacterChart.data.datasets[0].data = distribution.data;
	enemyCharacterChart.data.datasets[0].backgroundColor = distribution.colors;
	enemyCharacterChart.update();
});

onBeforeUnmount(() => {
	playerCharacterChart?.destroy();
	enemyCharacterChart?.destroy();
});
</script>

<style scoped>
.charts {
	display: flex;
	flex-wrap: wrap;
	gap: 2rem;
	justify-content: center;
	align-items: flex-start;
}

.chart {
	flex: 1 1 0;
	min-width: 280px;
	max-width: 400px;
	text-align: center;
}

.matchups {
	display: flex;
	flex-wrap: wrap;
	gap: 2rem;
	justify-content: center;
	align-items: flex-start;
	margin-top: 2rem;
}

.matchup-column {
	flex: 1 1 0;
	min-width: 280px;
	max-width: 640px;
}

.matchup-column h2 {
	text-align: center;
	margin-bottom: 1rem;
}

.matchup-empty {
	text-align: center;
	opacity: 0.6;
}

.matchup-row {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.5rem 0.75rem;
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.05);
	margin-bottom: 0.5rem;
}

.matchup-pairs {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
}

.matchup-pair {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.25rem 0.5rem;
	border-radius: 8px;
	background: rgba(0, 0, 0, 0.2);
}

.matchup-icon {
	width: 48px;
	height: 48px;
	object-fit: cover;
	border-radius: 8px;
}

.matchup-icon.opponent {
	transform: scaleX(-1);
}

.matchup-winrate {
	margin-left: auto;
	font-weight: 700;
	font-size: 1.1rem;
}
</style>
