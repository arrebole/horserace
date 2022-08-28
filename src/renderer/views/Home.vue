
<template>
  <section class="border p-10 border-gray-400">
    <div class="my-1">
      <span title="召唤师的编号">ID: </span>
      <span>{{ profile.summonerId }}</span>
    </div>

    <div class="my-1">
      <span title="召唤师的名字"> 昵称: </span>
      <span>{{ profile.displayName }}</span>
    </div>

    <div class="my-1">
      <span title="召唤师等级">等级: </span>
      <span>{{ profile.summonerLevel }}</span>
    </div>

    <div class="my-1">
      <span title="升级需要的经验">经验: </span>
      <span>{{ profile.xpSinceLastLevel }}</span>
      <span> / </span>
      <span>{{ profile.xpUntilNextLevel }}</span>
    </div>

    <div class="my-1">
      <span title="大乱斗重选次数">骰子: </span>
      <span>{{ profile.rerollPoints.numberOfRolls }}</span>
      <span> / </span>
      <span>{{ profile.rerollPoints.maxRolls }}</span>
    </div>

    <div class="my-1">
      <span title="250 换一个骰子">积分: </span>
      <span>{{ profile.rerollPoints.currentPoints }}</span>
      <span> / </span>
      <span>{{
        profile.rerollPoints.pointsCostToRoll * profile.rerollPoints.maxRolls
      }}</span>
    </div>
  </section>

  <section class="border border-t-0 p-10 border-gray-400">
    <div>❤ 自动接受对局</div>
    <div>❤ 自动对局分析</div>
  </section>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
import { useStore } from '../store';

export default defineComponent({
  setup() {
    const { profile } = storeToRefs(useStore());
    return {
      profile,
    };
  },
});
</script>