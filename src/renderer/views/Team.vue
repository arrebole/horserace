
<template>
  <section
    v-if="gameflow.teamOne.length > 0"
    class="border border-gray-400 divide-y divide-gray-400 text-xs shadow-md"
  >
    <div class="text-center bg-gray-300 text-green-600">TeamOne</div>
    <div
      class="p-2 flex"
      v-for="summoner in gameflow.teamOne"
      :key="summoner.summonerName"
    >
      <div class="w-24">{{ summoner.summonerName }}</div>

      <div class="w-20">
        <span>{{ summoner.horse.label }}</span>
        <span>({{ summoner.horse.score }})</span>
      </div>

      <div class="px-1">
        <span>
          <span>{{ summoner.rank.flexSR.tierZh }}</span>
          <span>{{ summoner.rank.flexSR.division }}</span>
          <span>({{ summoner.rank.flexSR.leaguePoints }})</span>
        </span>
        <span>/</span>
        <span>
          <span>{{ summoner.rank.solo5x5.tierZh }}</span>
          <span>{{ summoner.rank.solo5x5.division }}</span>
          <span>({{ summoner.rank.solo5x5.leaguePoints }})</span>
        </span>
      </div>
    </div>
  </section>

  <section
    v-if="gameflow.teamTwo.length > 0"
    class="
      border border-gray-400
      divide-y divide-gray-400
      text-xs
      shadow-md
      pt-2
    "
  >
    <div class="text-center bg-gray-300 text-green-600">TeamTwo</div>
    <div
      class="p-2 flex"
      v-for="summoner in gameflow.teamTwo"
      :key="summoner.summonerName"
    >
      <div class="w-24">{{ summoner.summonerName }}</div>

      <div class="w-20">
        <span>{{ summoner.horse.label }}</span>
        <span>({{ summoner.horse.score }})</span>
      </div>

      <div class="px-1">
        <span>
          <span>{{ summoner.rank.flexSR.tierZh }}</span>
          <span>{{ summoner.rank.flexSR.division }}</span>
          <span>({{ summoner.rank.flexSR.leaguePoints }})</span>
        </span>
        <span>/</span>
        <span>
          <span>{{ summoner.rank.solo5x5.tierZh }}</span>
          <span>{{ summoner.rank.solo5x5.division }}</span>
          <span>({{ summoner.rank.solo5x5.leaguePoints }})</span>
        </span>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
import { useStore } from "../store";

export default defineComponent({
  setup() {
    const { gameflow } = storeToRefs(useStore());
    return {
      gameflow,
    };
  },
});
</script>