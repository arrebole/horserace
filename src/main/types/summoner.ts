
export interface Summoner {
    // 账号ID
    accountId: number;

    // 召唤师ID
    summonerId: number,

    // 全球唯一UUID
    puuid: string

    // 显示名称
    displayName: string;

    // 内部昵称
    internalName: string;

    // 是否修改名称
    nameChangeFlag: boolean;

    // 匿名
    unnamed: false

    // 召唤师等级
    summonerLevel: 380

    // 距离下次升级还需要百分之多少经验
    percentCompleteForNextLevel: number

    // 上一个等级的经验
    xpSinceLastLevel: number

    // 到达下一个等级需要的经验
    xpUntilNextLevel: number

    // 资料公开性
    privacy: string

    // 头像
    profileIconId: number

    // 积分资产
    rerollPoints: RerollPoints
}

export interface RerollPoints {
    
    // 当前积分
    currentPoints: number

    // 最大重选次数
    maxRolls: number

    // 当前可以重选次数
    numberOfRolls: number

    // 消费多少积分可以换重选次数
    pointsCostToRoll: number

    pointsToReroll: number
}