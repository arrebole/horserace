import { Game } from "./matchs"


export interface SummonerEffect {

    summonerName: string

    /**
     * 历史战绩
     */
    games: Game[],

    /**
     * 排位排名
     */
    rank: {
        flexSR: SummonerEffectRankedEntry
        solo5x5: SummonerEffectRankedEntry
    }

    /**
     * 马匹信息
     */
    horse: {
        label: string
        score: number
    }
}

export interface SummonerEffectRankedEntry {
    tier: string
    tierZh: string
    division: string
    leaguePoints: string | number
}