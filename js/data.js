const assets_locations_roa2 = {
  stages: {
    "Aetherian Forest": "roa2/stages/AetherianForest.png",
    "Godai Delta": "roa2/stages/GodaiDelta.png",
    Hodojo: "roa2/stages/Hodojo.png",
    Julesvale: "roa2/stages/Julesvale.png",
    "Merchant Port": "roa2/stages/MerchantPort.png",
    "Air Armada": "roa2/stages/AirArmada.png",
    "Fire Capital": "roa2/stages/FireCapital.png",
    "Hyperborean Harbor": "roa2/stages/HyperboreanHarbor.png",
    "Rock Wall": "roa2/stages/RockWall.png",
    "Tempest Peak": "roa2/stages/TempestPeak.png",
    "Forest Understory": "roa2/stages/ForestUnderstory.png",
    "Stormswept Pillar": "roa2/stages/StormsweptPillar.png",
  },
  characters: {
    Clairen: "roa2/characters/RoA2_Clairen_Portrait.png",
    Etalus: "roa2/characters/RoA2_Etalus_Portrait.png",
    Fleet: "roa2/characters/RoA2_Fleet_Portrait.png",
    Forsburn: "roa2/characters/RoA2_Forsburn_Portrait.png",
    Kragg: "roa2/characters/RoA2_Kragg_Portrait.png",
    Loxodont: "roa2/characters/RoA2_Loxodont_Portrait.png",
    Maypul: "roa2/characters/RoA2_Maypul_Portrait.png",
    Orcane: "roa2/characters/RoA2_Orcane_Portrait.png",
    Ranno: "roa2/characters/RoA2_Ranno_Portrait.png",
    Wrastor: "roa2/characters/RoA2_Wrastor_Portrait.png",
    Zetterburn: "roa2/characters/RoA2_Zetterburn_Portrait.png",
  },
};

/**
 * example of match data
 */
data_matches_example = {
  game: "roa2",
  type: "singles",
  bestOf: 3,
  matches: [
    {
      enemy_name: "some name",
      enemy_elo: 1200,
      my_elo: 1200,
      stages: ["Aetherian Forest", "Air Armada", "Hodojo"],
      my_characters: ["Orcane", "Orcane", "Kragg"],
      enemy_characters: ["Zetterburn", "Zetterburn", "Zetterburn"],
      results: [true, false, true],
      links: [
        {
          text: "some text",
          link: "somelink.com",
        },
      ],
      my_score: 2,
    },
    {
      enemy_name: "some name",
      enemy_elo: 1200,
      my_elo: 1300,
      stages: ["Godai Delta", "Hyperborean Harbor"],
      my_characters: ["Orcane", "Orcane"],
      enemy_characters: ["Clairen", "Clairen"],
      results: [false, false],
      my_score: 0,
    },
  ],
};

function diplay_matches(data) {
  let html = "";
  data.matches.forEach((match) => (html += build_match_html(match)));
  document.getElementById("matchesDisplay").innerHTML = html;
}

function build_match_html(match) {
  let html = `
  <div class="container match p-2">
    <div class="match-header text-center">
      <div class="match-header-players">
        <div class="match-header-players-me">
          <div class="match-header-players-my-name">Me</div>
          <div class="match-header-elo-my">${match.my_elo}</div>
        </div>
        <div class="match-header-players-enemy">
          <div class="match-header-players-enemy-name">${match.enemy_name}</div>
          <div class="match-header-elo-enemy">${match.enemy_elo}</div>
        </div>
      </div>
    </div>
    <div class="match-body">
      <div class="match-body-rounds">
    `;
  for (let i = 0; i < match.stages.length; i++) {
    html += `
        <div class="match-body-round-${
          match.results[i] ? "win" : "loss"
        } text-center d-flex flex-nowrap">
          <img src="assets/${
            assets_locations_roa2.stages[match.stages[i]]
          }" class=" mx-auto p-1" style="height:99px ;width:176px" alt="${
      match.stages[i]
    }">
          <img src="assets/${
            assets_locations_roa2.characters[match.my_characters[i]]
          }"
            class="match-body-round-character-my p-1" style="height:100px ;width:100px" alt="${
              match.my_characters[i]
            }">
          <img src="assets/${
            assets_locations_roa2.characters[match.enemy_characters[i]]
          }"
            class="match-body-round-character-enemy p-1" style="height:100px ;width:100px" alt="${
              match.enemy_characters[i]
            }">
        </div>
    `;
  }
  html += `
      </div>
    </div>
  </div>
  `;
  return html;
}
