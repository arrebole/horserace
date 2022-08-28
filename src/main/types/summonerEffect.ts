

export interface SummonerEffect {

    summonerName: string

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