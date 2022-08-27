import { TeamSummoner } from './teamSummoner'

export interface GameflowSession {
    phase: string
    gameClient: GameClient
    gameData: GameData
}

export interface GameClient {
    observerServerIp: string
    observerServerPort: number
    running: boolean
    serverIp: string
    serverPort: number
    visible: boolean
}

export interface GameData {
    GameId: number
    GameName: string
    IsCustomGame: boolean
    Password: string
    playerChampionSelections: any[]
    queue: Queue
    spectatorsAllowed: boolean
    teamOne: TeamSummoner[]
    teamTwo: TeamSummoner[]
}

export interface Queue {
    id: number
    name: string
    type: string
    mapId: number
    maxLevel: number
    allowablePremadeSizes: number[],
    areFreeChampionsAllowed: boolean
    assetMutator: string
    category: string
    championsRequiredToPlay: number
    description: string
    detailedDescription: string
    gameMode: string
    isRanked: boolean
    isTeamBuilderManaged: boolean
    isTeamOnly: boolean
    lastToggledOffTime: number
    lastToggledOnTime: number
    maxSummonerLevelForFirstWinOfTheDay: number
    maximumParticipantListSize: number
    minLevel: number
    minimumParticipantListSize: number
    numPlayersPerTeam: 5,
    queueAvailability: string
    removalFromGameAllowed: boolean
    removalFromGameDelayMinutes: number
    shortName: string
    showPositionSelector: boolean
    spectatorEnabled: boolean
}