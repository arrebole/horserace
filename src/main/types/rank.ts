
export interface RankedStats {
    earnedRegaliaRewardIds: any[]
    highestPreviousSeasonAchievedDivision: string
    highestPreviousSeasonAchievedTier: string
    highestPreviousSeasonEndDivision: string
    highestPreviousSeasonEndTier: string
    highestRankedEntry: RankedEntry
    highestRankedEntrySR: RankedEntry
    queueMap: {
        /** 单双排 */
        RANKED_FLEX_SR: RankedEntry
        /** 灵活组排 */
        RANKED_SOLO_5x5: RankedEntry
        RANKED_TFT: RankedEntry
        RANKED_TFT_DOUBLE_UP: RankedEntry
        RANKED_TFT_TURBO: RankedEntry
    },
    queues: RankedEntry[]
    rankedRegaliaLevel: number
    seasons: {
        RANKED_FLEX_SR: RankScession
        RANKED_SOLO_5x5: RankScession
        RANKED_TFT: RankScession
        RANKED_TFT_DOUBLE_UP: RankScession
        RANKED_TFT_TURBO: RankScession
    },
    splitsProgress: {
        "1": number
        "2": number
        "3": number
    }
}

export interface RankedEntry {
    division: string
    isProvisional: boolean
    leaguePoints: number
    losses: number
    miniSeriesProgress: string
    previousSeasonAchievedDivision: string
    previousSeasonAchievedTier: string
    previousSeasonEndDivision: string
    previousSeasonEndTier: string
    provisionalGameThreshold: number
    provisionalGamesRemaining: number
    queueType: string
    ratedRating: number
    ratedTier: string
    tier: string
    warnings?: {
        daysUntilDecay: number
        demotionWarning: number
        displayDecayWarning: boolean
        timeUntilInactivityStatusChanges: number
    }
    wins: number
}

// 赛季时间
export interface RankScession {
    currentSeasonEnd: number
    currentSeasonId: number
    nextSeasonStart: number
}