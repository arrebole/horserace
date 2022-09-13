
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
      <span>
        {{ profile.rerollPoints.pointsCostToRoll * profile.rerollPoints.maxRolls }}
      </span>
    </div>
  </section>

  <section class="border border-t-0 px-10 py-5 border-gray-400">
    <div>
      <span>自动接受对局</span>
      <select class="bg-black px-1 mx-1 border-gray-400 border" @change="onChangeAutoAcceptMatch">
        <option value="0">否</option>
        <option value="1" selected>是</option>
      </select>
    </div>
    <div>
      <span>自动禁用英雄</span>
      <select class="bg-black px-1 mx-1 border-gray-400 border" @change="onChangeAutoBanChampion">
        <option value="0" selected>无</option>
        <option v-for="champion in champions" :value="champion.champId">{{ champion.title }}</option>
      </select>
    </div>
    <div>
      <span>自动选择英雄</span>
      <select class="bg-black px-1 mx-1 border-gray-400 border" @change="onChangeAutoPickChampion">
        <option value="0" selected>无</option>
        <option v-for="champion in champions" :value="champion.champId">{{ champion.title }}</option>
      </select>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from '../store';
import { champions } from '../../shared/champions';

const { profile } = storeToRefs(useStore());

// 自动接收对局
function onChangeAutoAcceptMatch(e: Event) {
  // @ts-ignore
  window.electronAPI.setAutoAcceptMatch(parseInt(e.target.value));
}

// 自动选择英雄
function onChangeAutoPickChampion(e: Event) {
  // @ts-ignore
  window.electronAPI.setAutoPickChampion(parseInt(e.target.value));
}

// 自动ban英雄
function onChangeAutoBanChampion(e: Event) {
  // @ts-ignore
  window.electronAPI.setAutoBanChampion(parseInt(e.target.value));
}


</script>