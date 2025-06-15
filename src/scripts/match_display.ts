import { get_match_data } from "./data";
import { getRivalIconPathByName, getStageIconPathByName } from "./roa2";

export function display_matches() {
  console.log("display_matches() called");
  let match_data = get_match_data();
  display_matches_for_data(match_data);
}

var html_match_data_elements = [];

function display_matches_for_data(data) {
  data.matches.forEach((match) => html_match_data_elements.push(build_match_html(match)));
  display_matches_with_order(true);
}

function display_matches_with_order(is_ascending) {
  let html = "";
  if (is_ascending) {
    html_match_data_elements.forEach((match) => (html += match));
  } else {
    for (let i = html_match_data_elements.length - 1; i >= 0; i--) {
      html += html_match_data_elements[i];
    }
  }
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
          <img src="${getStageIconPathByName(
            match.stages[i]
          )}" class=" mx-auto p-1" style="height:99px ;width:176px" alt="${match.stages[i]}">
          <img src="${getRivalIconPathByName(match.my_characters[i])}"
            class="match-body-character p-1" alt="${match.my_characters[i]}">
          <img src="${getRivalIconPathByName(match.enemy_characters[i])}"
            class="match-body-character p-1" alt="${match.enemy_characters[i]}">
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
