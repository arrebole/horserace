
<template>
  <section
    v-if="gameflow.teamOne.length > 0"
    class="border border-gray-400 divide-y divide-gray-400 text-xs shadow-md"
  >
    <div class="text-center bg-gray-300">TeamOne</div>
    <div class="p-2 flex" v-for="summoner in gameflow.teamOne" :key="summoner.name">
      <div class="px-1 w-11">{{ summoner.label }}</div>
      <div class="px-2">({{ summoner.score }})</div>
      <div>{{ summoner.name }}</div>
    </div>
  </section>

  <section
    v-if="gameflow.teamTwo.length > 0"
    class="border border-gray-400 divide-y divide-gray-400 text-xs shadow-md pt-2"
  >
    <div class="text-center bg-gray-300">TeamTwo</div>
    <div class="p-2 flex" v-for="summoner in gameflow.teamTwo" :key="summoner.name">
      <div class="px-1 w-11">{{ summoner.label }}</div>
      <div class="px-2">({{ summoner.score }})</div>
      <div>{{ summoner.name }}</div>
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