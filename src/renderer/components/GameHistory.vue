<template>
    <div 
        style="width: 360px; height: 320px;"
        class="absolute top-0 left-0 bottom-0 right-0 flex flex-col m-auto bg-black border-gray-400 border z-10"
    >
        <div class="text-center border-b p-2">
            {{ summonerName }}
        </div>
        <div
            class="divide-y divide-x overflow-y-scroll scroll-container h-full"
        >
            <div v-for="game in games" :key="game.gameId" class="flex divide-x">
                <span class="p-1 w-20">{{ game.champion }} </span>
                <span class="p-1 w-10">{{ game.win }} </span>
                <span class="p-1 w-20">{{ game.gameType }} </span>
                <div class="p-1 w-16">
                    <span>{{ game.kills }}</span>
                    <span>/</span>
                    <span>{{ game.deaths }}</span>
                    <span>/</span>
                    <span>{{ game.assists }}</span>
                </div>
                <div class="p-1">{{ game.gameCreationDate }}</div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import type { Game } from '../../main/types/matchs';
import { queueIdToGameZhType } from '../../shared/queue';
import { findChampion } from '../../shared/champions';

import dayjs from 'dayjs/esm';

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
    gameCreationDate: dayjs(v.gameCreationDate).format('MM-DD HH:mm'),
    kills: v.participants[0].stats.kills,
    deaths: v.participants[0].stats.deaths,
    assists: v.participants[0].stats.assists,
}));
</script>