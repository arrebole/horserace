
<template>
  <div 
    class="flex border-gray-400 divide-x divide-gray-400 border" 
    v-for="summoner in summoners"
    :key="summoner.summonerName"
  >
    <div class="w-32 p-2 cursor-pointer hover:bg-green-700" @click.stop="handleOpenGamesWindow(summoner)">
      {{ summoner.summonerName }}
    </div>
    <div class="w-24 p-2">
      <span>{{ summoner.horse.label }}</span>
      <span>({{ summoner.horse.score }})</span>
    </div>
    <div class="p-2">
      <span>
        <span>{{ summoner.rank.solo5x5.tierZh }}</span>
        <span>{{ summoner.rank.solo5x5.division }}</span>
        <span>({{ summoner.rank.solo5x5.leaguePoints }})</span>
      </span>
      <span>/</span>
      <span>
        <span>{{ summoner.rank.flexSR.tierZh }}</span>
        <span>{{ summoner.rank.flexSR.division }}</span>
        <span>({{ summoner.rank.flexSR.leaguePoints }})</span>
      </span>

    </div>
  </div>
  <GameHistory 
    v-if="isShowGameshWindow"
    :summonerName="selectdSummoner?.summonerName"
    :games="selectdSummoner?.games"
    :onClose="handleCloseGamesWindow"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { SummonerEffect } from '../../main/types/summonerEffect';
import GameHistory from './GameHistory.vue';

interface Props {
  teamName: string
  summoners: SummonerEffect[]
}
const { summoners } = defineProps<Props>();
const isShowGameshWindow = ref(false);

// 需要展示的游戏对局记录
const selectdSummoner = ref<SummonerEffect>();

// 打开游戏对局窗口
function handleOpenGamesWindow(summoner: SummonerEffect) {
  isShowGameshWindow.value = true;
  selectdSummoner.value = summoner;
}

function handleCloseGamesWindow() {
  isShowGameshWindow.value = false;
}

</script>