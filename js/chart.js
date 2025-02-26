console.log("chart.js loaded");

const character = [
  "Clairen",
  "Etalus",
  "Fleet",
  "Forsburn",
  "Kragg",
  "Loxodont",
  "Maypul",
  "Orcane",
  "Ranno",
  "Wrastor",
  "Zetterburn",
];

const character_colors = [
  "#FF0000",
  "#FFA500",
  "#FFFF00",
  "#008000",
  "#0000FF",
  "#4B0082",
  "#EE82EE",
  "#FF1493",
  "#FF4500",
  "#00FFFF",
  "#FFD700",
];

var pi_chart_enemys;
Chart.defaults.color = "#FFFFFF"; // set default color for charts
Chart.defaults.font.size = 16; // set default font size for charts

// dispay chart with given data
function displayPiChartEnemys() {
  console.log("displayChart() called");
  const ctx = document.getElementById("piChartEnemys");
  if (pi_chart_enemys) {
    pi_chart_enemys.destroy();
  }

  pi_chart_enemys = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: character,
      datasets: [
        {
          label: "character encounters",
          data: count_enemy_characters(),
          backgroundColor: character_colors,
          hoverOffset: 4,
          borderWidth: 0,
        },
      ],
    },
    options: {},
  });
}

function count_enemy_characters() {
  const counts = Array(character.length).fill(0);
  const match_data = get_match_data();
  match_data.matches.forEach((match) => {
    for (let i = 0; i < match.enemy_characters.length; i++) {
      let index = character.indexOf(match.enemy_characters[i]);
      counts[index]++;
    }
  });
  return counts;
}
