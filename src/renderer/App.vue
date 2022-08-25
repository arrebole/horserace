
<template>
  <main class="font-mono p-5 cursor-default">
    <section class="border p-4 border-gray-400">
      <div class="my-1">
        <sapn title="召唤师的编号">ID: </sapn>
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
        <span>{{ profile.rerollPoints.pointsCostToRoll * profile.rerollPoints.maxRolls }}</span>
      </div>
    </section>

    <section class="border border-t-0 p-4 border-gray-400">
      <div>❤ 自动接受对局</div>
      <div>❤ 自动对局分析</div>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  setup() {
    const profile = reactive({
      accountId: 0,
      summonerId: 0,
      puuid: "",
      displayName: "null",
      summonerLevel: 0,
      percentCompleteForNextLevel: 0,
      xpSinceLastLevel: 0,
      xpUntilNextLevel: 0,
      privacy: "null",
      profileIconId: 0,
      rerollPoints: {
        maxRolls: 2,
        numberOfRolls: 0,
        currentPoints: 0,
        pointsCostToRoll: 250,
        pointsToReroll: 0,
      },
    });

    // @ts-ignore
    window.electronAPI?.onUpdateProfile((event, value) => {
      Object.assign(profile, value);
    });

    return { profile };
  },
});
</script>
