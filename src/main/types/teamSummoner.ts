
export interface TeamSummoner {

  // 基本召唤师信息
  accountId: number

  originalAccountNumber: number

  puuid: string

  profileIconId: number

  summonerId: number

  summonerInternalName: string

  summonerName: string

  /**
   * 队伍ID
   */
  teamId: string

  /**
   * 调整标志
   */
  adjustmentFlags: number

  /**
   * 【人机】机器人难度，如果这个召唤师是人机
   */
  botDifficulty: string

  /**
   * 机器人技能等级
   */
  botSkillLevel: number

  /**
   * 客户端同步
   */
  clientInSynch: boolean

  /**
   * 自定义游戏设置
   */
  gameCustomization: {
    Regalia: string
    Perks: string
    SummonerEmotes: string
  }

  /* 索引 */
  index: number

  /**
   * 最后选择的皮肤索引
   */
  lastSelectedSkinIndex: number

  /**
   * 地区
   */
  locale: number

  /**
   * 次要的
   */
  minor: boolean

  /**
   * 原始平台 ID
   */
  originalPlatformId: string

  /**
   * 伙伴ID
   */
  partnerId: string

  /**
   * 选择模式
   */
  pickMode: number

  /**
   * 挑拨
   */
  pickTurn: number

  /**
   * 排队评分
   */
  queueRating: number

  /**
   * 排位队客人
   */
  rankedTeamGuest: boolean

  /**
   * 选择位置
   */
  selectedPosition: any

  /**
   * 选择角色
   */
  selectedRole: any

  /**
   * 队伍拥有者
   */
  teamOwner: boolean

  /**
   * 团队参与者 ID
   */
  teamParticipantId: any

  /**
   * 团队评分
   */
  teamRating: number

  /**
   * 排队时间
   */
  timeAddedToQueue: any

  /**
   * 选择英雄时间
   */
  timeChampionSelectStart: number

  /**
   * 游戏开始时间
   */
  timeGameCreated: number

  /**
   * 时间对接开始
   */
  timeMatchmakingStart: number

  /**
   * 投票者评级
   */
  voterRating: number

  /**
   * 英雄ID
   */
  championId: any

  /**
   * 角色
   */
  role: any

  spell1Id: any

  spell2Id: any
}