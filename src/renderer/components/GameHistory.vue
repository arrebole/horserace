<template>
    <div 
        style="height: 320px; width: 300px;"
        class="absolute top-0 left-0 bottom-0 right-0 m-auto bg-black border-gray-400 border z-10"
    >
        <div class="relative text-center divide-y divide-x p-3">
            {{ summonerName }}
        </div>
        <div 
            class="relative divide-y divide-x overflow-y-scroll scroll-container"
        >
            <div v-for="game in games" :key="game.gameId" class="flex divide-x">
                <span class="p-1 w-20">{{ game.champion }} </span>
                <span class="p-1 w-10">{{ game.win }} </span>
                <span class="p-1 w-20">{{ game.gameType }} </span>
                <div class="p-1">
                    <span>{{ game.kills }}</span>
                    <span>/</span>
                    <span>{{ game.deaths }}</span>
                    <span>/</span>
                    <span>{{ game.assists }}</span>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import type { Game } from '../../main/types/matchs';
import { queueIdToGameZhType } from '../../shared/queue';
import { findChampion } from '../../shared/champions';

interface Props {
    summonerName?: string
    games?: Game[]
}
const propos = defineProps<Props>();

const summonerName = propos.summonerName;
const games = propos.games?.map((v) => ({
    gameId: v.gameId,
    gameType: queueIdToGameZhType(v.queueId),
    champion: findChampion(v.participants[0].championId)?.label,
    win: v.participants[0].stats.win ? '胜利' : '失败',
    kills: v.participants[0].stats.kills,
    deaths: v.participants[0].stats.deaths,
    assists: v.participants[0].stats.assists,
}));
</script>