<template>
	<div v-if="!hasAnyMatches" class="matchup-empty overview-empty">No matchups collected yet</div>
	<template v-else>
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

	<div class="chart-legend">
		<div class="legend-items">
			<div
				v-for="rival in RIVALS"
				:key="rival.name"
				class="legend-item"
				:title="rival.name"
			>
				<span class="legend-swatch" :style="{ backgroundColor: rival.color }">
					<img class="legend-icon" :src="rival.iconPath" :alt="rival.name" />
				</span>
			</div>
		</div>
		<p class="legend-note">
			Outer ring: all games played &middot; Inner ring: ranked games only
		</p>
	</div>

	<div class="matchups">
		<div v-if="!hasMatchupData" class="matchup-empty">Not enough matchups collected</div>
		<template v-else>
		<div class="matchup-column">
			<h2>Best Matchups</h2>
			<div
				v-for="cluster in bestMatchups"
				:key="`best-${cluster.winrate}`"
				class="matchup-row"
			>
				<div class="matchup-pairs">
					<MatchupPair
						v-for="matchup in cluster.matchups"
						:key="`${matchup.player.name}-${matchup.opponent.name}`"
						:player="matchup.player"
						:opponent="matchup.opponent"
						:stages="matchup.bestStages"
					/>
				</div>
				<span class="matchup-winrate" :style="{ color: getWinrateColor(cluster.winrate) }">
					{{ formatWinrate(cluster.winrate) }}
				</span>
			</div>
		</div>

		<div class="matchup-column">
			<h2>Worst Matchups</h2>
			<div
				v-for="cluster in worstMatchups"
				:key="`worst-${cluster.winrate}`"
				class="matchup-row"
			>
				<div class="matchup-pairs">
					<MatchupPair
						v-for="matchup in cluster.matchups"
						:key="`${matchup.player.name}-${matchup.opponent.name}`"
						:player="matchup.player"
						:opponent="matchup.opponent"
						:stages="matchup.worstStages"
					/>
				</div>
				<span class="matchup-winrate" :style="{ color: getWinrateColor(cluster.winrate) }">
					{{ formatWinrate(cluster.winrate) }}
				</span>
			</div>
		</div>
		</template>
	</div>

	<div class="most-played">
		<h2>Most Played Matchups</h2>
		<div v-if="mostPlayedMatchups.length === 0" class="matchup-empty">No matchups yet</div>
		<div
			v-for="matchup in mostPlayedMatchups"
			:key="`most-${matchup.player.name}-${matchup.opponent.name}`"
			class="matchup-row"
		>
			<MatchupPair :player="matchup.player" :opponent="matchup.opponent" />
			<span class="matchup-played">{{ matchup.played }} rounds</span>
			<span class="matchup-winrate" :style="{ color: getWinrateColor(matchup.winrate) }">
				{{ formatWinrate(matchup.winrate) }}
			</span>
		</div>
	</div>
	</template>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { Chart, type ChartConfiguration, registerables } from 'chart.js';
import { useMatchStore } from '@/stores/matchStore';
import { RIVALS, STAGES } from '@/constants';
import type { Rival, RivalName, Stage, StageName } from '@/types/roa2Types';
import { getWinrateColor } from '@/scripts/utils';
import MatchupPair from '@/components/MatchupPair.vue';

Chart.register(...registerables);

const matchStore = useMatchStore();

const RIVAL_BY_NAME = new Map<RivalName, Rival>(RIVALS.map((rival) => [rival.name, rival]));

/** Minimum rounds a matchup needs before it counts toward best/worst matchups. */
const MIN_MATCHUP_ROUNDS = 10;

interface CharacterDistribution {
	labels: string[];
	data: number[];
	rankedData: number[];
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
	// Stage(s) with the highest / lowest winrate within this matchup. Ties keep
	// every stage that shares the extreme winrate.
	bestStages: Stage[];
	worstStages: Stage[];
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
	const rankedCounts = new Map<RivalName, number>();

	for (const collection of matchStore.getAllMatchCollections) {
		const isRanked = collection.type === 'ranked';
		for (const match of collection.matches) {
			for (const round of match.rounds) {
				const rival = round[side];
				counts.set(rival, (counts.get(rival) ?? 0) + 1);
				if (isRanked) {
					rankedCounts.set(rival, (rankedCounts.get(rival) ?? 0) + 1);
				}
			}
		}
	}

	const labels: string[] = [];
	const data: number[] = [];
	const rankedData: number[] = [];
	const colors: string[] = [];

	// Iterate RIVALS to keep a stable order and pull each character's color.
	for (const rival of RIVALS) {
		const count = counts.get(rival.name) ?? 0;
		if (count === 0) continue;
		labels.push(rival.name);
		data.push(count);
		rankedData.push(rankedCounts.get(rival.name) ?? 0);
		colors.push(rival.color);
	}

	return { labels, data, rankedData, colors };
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
	const grouped = new Map<
		string,
		{
			player: Rival;
			opponent: Rival;
			wins: number;
			played: number;
			stages: Map<StageName, { wins: number; played: number }>;
		}
	>();

	for (const collection of matchStore.getAllMatchCollections) {
		for (const match of collection.matches) {
			for (const round of match.rounds) {
				const player = RIVAL_BY_NAME.get(round.playerRival);
				const opponent = RIVAL_BY_NAME.get(round.opponentRival);
				if (!player || !opponent) continue;

				const key = `${player.name}__${opponent.name}`;
				const agg = grouped.get(key) ?? {
					player,
					opponent,
					wins: 0,
					played: 0,
					stages: new Map<StageName, { wins: number; played: number }>(),
				};
				agg.played += 1;
				if (round.won) agg.wins += 1;

				const stage = agg.stages.get(round.stage) ?? { wins: 0, played: 0 };
				stage.played += 1;
				if (round.won) stage.wins += 1;
				agg.stages.set(round.stage, stage);

				grouped.set(key, agg);
			}
		}
	}

	return Array.from(grouped.values())
		.map((agg) => {
			// Winrate per stage, ordered by the canonical STAGES order for stable
			// rendering of the split stage backgrounds.
			const stageWinrates = STAGES.map((stage) => ({ stage, entry: agg.stages.get(stage.name) }))
				.filter((s): s is { stage: Stage; entry: { wins: number; played: number } } => !!s.entry)
				.map((s) => ({ stage: s.stage, winrate: s.entry.wins / s.entry.played }));

			const winrates = stageWinrates.map((s) => s.winrate);
			const maxWinrate = Math.max(...winrates);
			const minWinrate = Math.min(...winrates);

			return {
				player: agg.player,
				opponent: agg.opponent,
				played: agg.played,
				winrate: agg.wins / agg.played,
				bestStages: stageWinrates.filter((s) => s.winrate === maxWinrate).map((s) => s.stage),
				worstStages: stageWinrates.filter((s) => s.winrate === minWinrate).map((s) => s.stage),
			};
		})
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

	// matchupStats is already sorted by winrate (descending). Only matchups with
	// enough rounds played are eligible for the best/worst lists.
	for (const matchup of matchupStats.value) {
		if (matchup.played < MIN_MATCHUP_ROUNDS) continue;
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

/** Whether any matchup meets the minimum-rounds threshold for best/worst lists. */
const hasMatchupData = computed(() => matchupClusters.value.length > 0);

/** Whether at least one round has been saved across every collection. */
const hasAnyMatches = computed(() =>
	matchStore.getAllMatchCollections.some((collection) =>
		collection.matches.some((match) => match.rounds.length > 0),
	),
);

/** The 10 matchups that were played the most, ordered by rounds played. */
const mostPlayedMatchups = computed<MatchupStat[]>(() =>
	[...matchupStats.value].sort((a, b) => b.played - a.played).slice(0, 10),
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
				{
					// Transparent spacer ring that creates a gap between the total
					// and ranked rings.
					label: '',
					data: distribution.data,
					backgroundColor: 'rgba(0, 0, 0, 0)',
					borderColor: 'rgba(0, 0, 0, 0)',
					hoverOffset: 0,
					weight: 0.15,
				},
				{
					label: 'Ranked rounds',
					data: distribution.rankedData,
					backgroundColor: distribution.colors,
					borderColor: 'rgba(0, 0, 0, 0)',
					hoverOffset: 4,
					// Draw this dataset as a smaller inner ring.
					weight: 0.6,
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
	initCharts();
});

function initCharts() {
	if (playerCharacterCanvas.value && !playerCharacterChart) {
		playerCharacterChart = new Chart(playerCharacterCanvas.value, toConfig(playerDistribution.value));
	}
	if (enemyCharacterCanvas.value && !enemyCharacterChart) {
		enemyCharacterChart = new Chart(enemyCharacterCanvas.value, toConfig(enemyDistribution.value));
	}
}

// The canvases live behind a v-if, so they may only appear once matches exist.
// Create the charts as soon as the canvas elements are available.
watch([playerCharacterCanvas, enemyCharacterCanvas], () => {
	initCharts();
});

watch(playerDistribution, (distribution) => {
	if (!playerCharacterChart) return;
	playerCharacterChart.data.labels = distribution.labels;
	playerCharacterChart.data.datasets[0].data = distribution.data;
	playerCharacterChart.data.datasets[0].backgroundColor = distribution.colors;
	playerCharacterChart.data.datasets[1].data = distribution.data;
	playerCharacterChart.data.datasets[2].data = distribution.rankedData;
	playerCharacterChart.data.datasets[2].backgroundColor = distribution.colors;
	playerCharacterChart.update();
});

watch(enemyDistribution, (distribution) => {
	if (!enemyCharacterChart) return;
	enemyCharacterChart.data.labels = distribution.labels;
	enemyCharacterChart.data.datasets[0].data = distribution.data;
	enemyCharacterChart.data.datasets[0].backgroundColor = distribution.colors;
	enemyCharacterChart.data.datasets[1].data = distribution.data;
	enemyCharacterChart.data.datasets[2].data = distribution.rankedData;
	enemyCharacterChart.data.datasets[2].backgroundColor = distribution.colors;
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

.chart-legend {
	margin: 1.5rem auto 0;
	max-width: 640px;
	text-align: center;
}

.legend-items {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	justify-content: center;
}

.legend-swatch {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 20px;
	border-radius: 6px;
	overflow: hidden;
}

.legend-icon {
	width: 16px;
	height: 16px;
	object-fit: cover;
	border-radius: 4px;
}

.legend-note {
	margin-top: 0.75rem;
	opacity: 0.7;
	font-size: 0.9rem;
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
	gap: 0.5rem;
	padding: 0.4rem 0.6rem;
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.05);
	margin-bottom: 0.4rem;
}

.matchup-pairs {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
}

.matchup-winrate {
	margin-left: auto;
	font-weight: 700;
	font-size: 1.1rem;
}

.most-played {
	margin: 2rem auto 0;
	max-width: 420px;
}

.most-played h2 {
	text-align: center;
	margin-bottom: 1rem;
}

.matchup-played {
	margin-left: 0.75rem;
	opacity: 0.75;
}
</style>
