<template>
    <div class="border-gray-400 z-10 border absolute top-0 left-0 bottom-0 right-0 m-auto bg-black divide-y divide-x overflow-y-scroll scroll-container"
        style="height: 300px; width: 300px;">
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
</template>


<script setup lang="ts">
import type { Game } from '../../main/types/matchs';
import { queueIdToGameZhType } from '../../shared/queue';
import { findChampion } from '../../shared/champions';

interface Props {
    games: Game[]
}
const propos = defineProps<Props>();

const games = propos.games.map((v) => ({
    gameId: v.gameId,
    gameType: queueIdToGameZhType(v.queueId),
    champion: findChampion(v.participants[0].championId)?.label,
    win: v.participants[0].stats.win ? '胜利' : '失败',
    kills: v.participants[0].stats.kills,
    deaths: v.participants[0].stats.deaths,
    assists: v.participants[0].stats.assists,
}));
</script>