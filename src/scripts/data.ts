import { display_matches } from "./match_display";

// load match data from localStorage
export function get_match_data() {
  console.log("get_match_data() called");
  var match_data = JSON.parse(localStorage.getItem("match_data"));
  if (!match_data) {
    match_data = [];
    localStorage.setItem("match_data", JSON.stringify(match_data));
  }
  return match_data;
}

// save match data to localStorage
function set_match_data(match_data) {
  console.log("set_match_data() called");

  match_data.matches = match_data.matches.sort((a, b) => a.match_id > b.match_id);
  localStorage.setItem("match_data", JSON.stringify(match_data));
}

// get uploaded file
function replaceUploadedData() {
  console.log("replaceUploadedData() called");
  // get file from file input field
  const input = document.getElementById("uploadMatches") as HTMLInputElement;
  if (!input) {
    console.log("input element 'uploadMatches' not found");
    return;
  }
  const file = input.files && input.files.length > 0 ? input.files[0] : null;
  if (!file) {
    console.log("no file uploaded");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (event) {
    const matches = parse_csv(event.target.result);
    const match_data = {
      game: "roa2",
      type: "singles",
      bestOf: 3,
      matches: matches,
    };
    set_match_data(match_data);

    //must be called here because of the async nature of file reading
    display_matches();
  };
  reader.readAsText(file);
}

function parse_csv(csv) {
  console.log("parse_csv() called");
  const matches = [];

  const lines = csv.split("\n");
  const headers = lines[0].split(",");

  var i = 1;
  if (Number.isInteger(headers[0])) {
    // no header, start at first line
    i = 0;
  }
  for (; i < lines.length; i++) {
    var currentline = lines[i].split(",");
    currentline = currentline.map((s) => s.trim());
    var match = matches.find((m) => m.match_id == currentline[0]);
    if (match) {
      // match already exists, add to it
      match.my_characters.push(currentline[1]);
      match.enemy_characters.push(currentline[2]);
      match.stages.push(currentline[3]);
      match.results.push(currentline[4] == "Win");
    } else {
      // new match
      match = {
        match_id: Number(currentline[0]),
        enemy_name: currentline[5],
        enemy_elo: Number(currentline[6]),
        my_elo: Number(currentline[7]),
        my_characters: [currentline[1]],
        enemy_characters: [currentline[2]],
        stages: [currentline[3]],
        results: [currentline[4] == "Win"],
        links: [],
      };
      matches.push(match);
    }
  }
  console.log(matches);
  return matches;
}

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
      match_id: 2,
      enemy_name: "some name",
      enemy_elo: 1200,
      my_elo: 1300,
      stages: ["Godai Delta", "Hyperborean Harbor"],
      my_characters: ["Orcane", "Orcane"],
      enemy_characters: ["Clairen", "Clairen"],
      results: [false, false],
      my_score: 0,
    },
    {
      match_id: 3,
      enemy_name: "some name",
      enemy_elo: 1200,
      my_elo: 1300,
      stages: ["Julesvale"],
      my_characters: ["Orcane"],
      enemy_characters: ["Loxodont"],
      results: [true],
      my_score: 1,
    },
    {
      match_id: 4,
      enemy_name: "some name",
      enemy_elo: 1200,
      my_elo: 1200,
      stages: ["Hodojo", "Hyperborean Harbor", "Rock Wall"],
      my_characters: ["Orcane", "Orcane", "Orcane"],
      enemy_characters: ["Ranno", "Ranno", "Orcane"],
      results: [false, true, true],
      links: [
        {
          text: "some text",
          link: "somelink.com",
        },
      ],
      my_score: 2,
    },
  ],
};
