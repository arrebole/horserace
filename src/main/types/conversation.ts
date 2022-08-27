

export interface Conversation {
  gameName: string
  gameTag: string
  id: string
  inviterId: string
  isMuted: boolean
  lastMessage: any
  name: string
  password: string
  pid: string
  targetRegion: string
  type: string
  unreadMessageCount: number
}

export interface ConversationMsg {
  id: string
  type: string
  body: string
  fromId: string
  fromPid: string
  fromSummonerId: number
  isHistorical: boolean
  timestamp: number
}