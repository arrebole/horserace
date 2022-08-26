import { TeamSummoner } from "./teamSummoner"


export interface GameFlowSessionData {
    GameId: number
    GameName: string
    IsCustomGame: boolean
    Password: string
    playerChampionSelections: any
    queue: any
    spectatorsAllowed: boolean
    teamOne: TeamSummoner[]
    teamTwo: TeamSummoner[]
}