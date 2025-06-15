<template>
	<div class="match-display" id="matchesDisplay">
		<MatchItem
			v-for="match in data_matches_example.matches"
			:key="match.match_id"
			v-bind:match
		></MatchItem>
	</div>
	<BaseModal :show="showUploadModal" @close="showUploadModal = false">
		<template v-slot:header><h3>Upload Matches</h3></template></BaseModal
	>
	<BaseModal :show="showAddMatchModal" @close="showAddMatchModal = false">
		<template v-slot:header>
			<h3>Add Match</h3>
		</template>
	</BaseModal>
	<button
		v-if="!(showAddMatchModal || showUploadModal)"
		class="open-modal"
		@click="showAddMatchModal = true"
		style="bottom: 10px; right: 10px"
	>
		<img class="button-icon" src="/src/assets/site/plus.svg" alt="Upload" />
	</button>
	<button
		v-if="!(showAddMatchModal || showUploadModal)"
		class="open-modal"
		@click="showUploadModal = true"
		style="bottom: 10px; right: 60px"
	>
		<img class="button-icon" src="/src/assets/site/upload.svg" alt="Upload" />
	</button>
</template>

<script lang="ts" setup>
import MatchItem from "../components/MatchItem.vue";
import BaseModal from "../components/BaseModal.vue";
import { ref } from "vue";

const showUploadModal = ref(false);
const showAddMatchModal = ref(false);

/**
 * example of match data
 */
const data_matches_example = {
	game: "roa2",
	type: "singles",
	bestOf: 3,
	matches: [
		{
			match_id: 1,
			opponent_name: "some name",
			opponent_elo: 1200,
			player_elo: 1200,
			stages: ["Aetherian Forest", "Air Armada", "Hodojo"],
			player_characters: ["Orcane", "Orcane", "Kragg"],
			opponent_characters: ["Zetterburn", "Zetterburn", "Zetterburn"],
			results: [true, false, true],
			links: [
				{
					text: "some text",
					link: "somelink.com",
				},
			],
			player_score: 2,
		},
		{
			match_id: 2,
			opponent_name: "some name",
			opponent_elo: 1200,
			player_elo: 1300,
			stages: ["Godai Delta", "Hyperborean Harbor"],
			player_characters: ["Orcane", "Orcane"],
			opponent_characters: ["Clairen", "Clairen"],
			results: [false, false],
			player_score: 0,
		},
		{
			match_id: 3,
			opponent_name: "some name",
			opponent_elo: 1200,
			player_elo: 1300,
			stages: ["Julesvale"],
			player_characters: ["Orcane"],
			opponent_characters: ["Loxodont"],
			results: [true],
			player_score: 1,
		},
		{
			match_id: 4,
			opponent_name: "some name",
			opponent_elo: 1200,
			player_elo: 1200,
			stages: ["Hodojo", "Hyperborean Harbor", "Rock Wall"],
			player_characters: ["Orcane", "Orcane", "Orcane"],
			opponent_characters: ["Ranno", "Ranno", "Orcane"],
			results: [false, true, true],
			links: [
				{
					text: "some text",
					link: "somelink.com",
				},
			],
			player_score: 2,
		},
	],
};
</script>

<style scoped lang="css">
.match-display {
	display: flex;
	border-radius: 8px;
	padding: 1rem;
	gap: 1rem;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	width: 100%;
	max-width: none;
	box-sizing: border-box;
	/* margin: 0 auto; */
}

.open-modal {
	position: fixed;
	width: 40px;
	height: 40px;
	background-color: #42b983;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	filter: invert(1);
}

.button-icon {
	width: 24px;
	height: 24px;
}
</style>
