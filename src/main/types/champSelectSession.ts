

export interface ChampSelectSession {
    actions: Action[]
}

interface Action {
    id: number
    type: "ban" | "pick"
    actorCellId: number
    championId: number
    completed: boolean
    pickTurn: number
}