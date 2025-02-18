const data_roa2 = {
  stages: [
    { name: "Aetherian Forest", image: "roa2/stages/AetherianForest.png" },
    { name: "Godai Delta", image: "roa2/stages/GodaiDelta.png" },
    { name: "Hodojo", image: "roa2/stages/Hodojo.png" },
    { name: "Julesvale", image: "roa2/stages/Julesvale.png" },
    { name: "Merchant Port", image: "roa2/stages/MerchantPort.png" },
    { name: "Air Armada", image: "roa2/stages/AirArmada.png" },
    { name: "Fire Capital", image: "roa2/stages/FireCapital.png" },
    { name: "Hyperborean Harbor", image: "roa2/stages/HyperboreanHarbor.png" },
    { name: "Rock Wall", image: "roa2/stages/RockWall.png" },
    { name: "Tempest Peak", image: "roa2/stages/TempestPeak.png" },
    { name: "Forest Understory", image: "roa2/stages/ForestUnderstory.png" },
    { name: "Stormswept Pillar", image: "roa2/stages/StormsweptPillar.png" },
  ],
  characters: [
    { name: "Clairen", portrait: "roa2/characters/RoA2_Clairen_Portrait.png" },
    { name: "Etalus", portrait: "roa2/characters/RoA2_Etalus_Portrait.png" },
    { name: "Fleet", portrait: "roa2/characters/RoA2_Fleet_Portrait.png" },
    {
      name: "Forsburn",
      portrait: "roa2/characters/RoA2_Forsburn_Portrait.png",
    },
    { name: "Kragg", portrait: "roa2/characters/RoA2_Kragg_Portrait.png" },
    {
      name: "Loxodont",
      portrait: "roa2/characters/RoA2_Loxodont_Portrait.png",
    },
    { name: "Maypul", portait: "roa2/characters/RoA2_Maypul_Portrait.png" },
    { name: "Orcane", portait: "roa2/characters/RoA2_Orcane_Portrait.png" },
    { name: "Ranno", portait: "roa2/characters/RoA2_Ranno_Portrait.png" },
    { name: "Wrastor", portait: "roa2/characters/RoA2_Wrastor_Portrait.png" },
    {
      name: "Zetterburn",
      portait: "roa2/characters/RoA2_Zetterburn_Portrait.png",
    },
  ],
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
  <div class="match">
    <div class="match-header">
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
      <div class="match-header-score">${match.my_score}</div>
    </div>
    <div class="match-body">
      <div class="match-body-rounds">
    `;
  for (let i = 0; i < match.stages.length; i++) {
    html += `
        <div class="match-body-round">
          <div class="match-body-round-stage">${match.stages[i]}</div>
          <div class="match-body-round-characters">
            <div class="match-body-round-character-my">${
              match.my_characters[i]
            }</div>
            <div class="match-body-round-character-enemy">${
              match.enemy_characters[i]
            }</div>
          </div>
          <div class="match-body-round-result">${
            match.results[i] ? "Win" : "Loss"
          }</div>
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
