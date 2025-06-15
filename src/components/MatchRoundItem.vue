<template>
  <div class="match-body-rounds">
    <div :class="`match-body-round-${result}`">
      <img :src="stageImg.src" class="mx-auto p-1" :alt="stageImg.alt" />
      <img :src="playerImg.src" class="match-body-character mx-auto p-1" :alt="playerImg.alt" />
      <img :src="opponentImg.src" class="match-body-character mx-auto p-1" :alt="opponentImg.alt" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { getRivalIconPathByName, getStageIconPathByName } from "../scripts/roa2.js";

const props = defineProps({
  stage: {
    type: String,
    required: true,
  },
  player: {
    type: String,
    required: true,
  },
  opponent: {
    type: String,
    required: true,
  },
  result: {
    type: Boolean,
    required: true,
  },
});

const result = computed(() => {
  return props.result ? "win" : "loss";
});

const stageImg = computed(() => {
  const iconPath = getStageIconPathByName(props.stage);
  return getPathToImage(props.stage, iconPath);
});
const playerImg = computed(() => {
  const iconPath = getRivalIconPathByName(props.player);
  return getPathToImage(props.player, iconPath);
});
const opponentImg = computed(() => {
  const iconPath = getRivalIconPathByName(props.opponent);
  return getPathToImage(props.opponent, iconPath);
});

function getPathToImage(imageName, pathToImage) {
  if (!pathToImage || pathToImage === "") {
    console.warn(`Stage not found: ${imageName}`);
    return { src: "", alt: imageName };
  }
  const host_url = location.protocol + "//" + window.location.host;
  const asset_path = pathToImage;
  return {
    src: new URL(host_url + asset_path).toString(),
    alt: imageName,
  };
}
</script>

<style scoped>
.p-1 {
  padding: 8px;
}

img {
  height: 99px;
  width: 176px;
}

.match-body-rounds {
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.match-body-round-win {
  background-color: rgba(132, 255, 138, 0.2);
}

.match-body-round-loss {
  background-color: rgba(255, 132, 132, 0.2);
}

.match-body-character {
  height: 100px;
  width: 100px;
}
</style>
