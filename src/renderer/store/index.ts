import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

export const useStore = defineStore('main', () => {
  const router = useRouter();

  // 用户信息
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
    }
  });

  // 游戏流程
  const gameflow = reactive({
    teamOne: [],
    teamTwo: [],
  });

  // 进入选人事件
  // @ts-ignore
  window.electronAPI.onInChampSelect((e, data)=>{
    if (data.teamOne) {
      gameflow.teamOne = data.teamOne;
    }
    router.replace({ name: 'team' });
  });

  // 游戏开始事件
  // @ts-ignore
  window.electronAPI.onInGameStart((e, data) => {
    if (data.teamOne) {
      gameflow.teamOne = data.teamOne;
    }
    if (data.teamTwo) {
      gameflow.teamTwo = data.teamTwo;
    }
  });

  // 游戏结束事件
  // @ts-ignore
  window.electronAPI.onInEndOfGame(() => {
    gameflow.teamOne = [];
    gameflow.teamTwo = [];
    router.replace({ name: 'home' })
  });

  // 第一次加载时，先获取当前用户信息
  // @ts-ignore
  window.electronAPI.onUpdateProfile((e, data) => {
    Object.assign(profile, data.profile);
  });

  return { profile, gameflow }
})