

export interface ChampSelectSession {
    actions: Action[][]
    localPlayerCellId: number
}

export interface Action {
    id: number
    type: "ban" | "pick"
    actorCellId: number
    championId: number
    completed: boolean
    pickTurn: number
    isAllyAction: boolean
    isInProgress: boolean
}