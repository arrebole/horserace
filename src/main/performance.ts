import { Game } from "./types/matchs";

export class PerformanceJudger {


  public parse(games: Game[]) {
    const score = this.getScore(games);
    const label = this.getLabel(score);
    return {
      score,
      label,
    }
  }

  private getLabel(score: number) {
    if (score >= 6000) {
      return "野马"
    }
    if (score >= 5000) {
      return "黑马"
    }
    if (score > 4000) {
      return "上等马"
    }
    if (score > 3500) {
      return "中等马"
    }
    if (score > 2000) {
      return "下等马"
    }
    return "牛马";
  }

  /**
   * 通过历史战绩给召唤师评分
   */
  private getScore(games: Game[]) {
    let score = 0;
    for (const game of games) {
      let scoreItem = 0;
      const stats = game.participants[0].stats;
      // 一血 +30 分
      if (stats.firstBloodKill) {
        scoreItem += 30;
      }
      // 一血助攻 +20 分
      if (stats.firstBloodAssist) {
        scoreItem += 20;
      }
      // 一塔 + 40
      if (stats.firstTowerKill) {
        scoreItem += 40;
      }
      // 一塔助攻 + 20
      if (stats.firstTowerAssist) {
        scoreItem += 20;
      }
      // 第一个水晶
      if (stats.firstInhibitorAssist) {
        scoreItem += 50;
      }
      // 五杀 +300
      if (stats.participantId > 0) {
        scoreItem += stats.participantId * 400;
      }
      // 四杀 +200
      if (stats.participantId > 0) {
        scoreItem += stats.participantId * 300;
      }
      // 三杀 +60
      if (stats.tripleKills > 0) {
        scoreItem += stats.tripleKills * 60;
      }
      // 三杀 +20
      if (stats.doubleKills > 0) {
        scoreItem += stats.doubleKills * 20;
      }
      // 赢得比赛 + 100
      if (stats.win) {
        scoreItem += 100
      }

      // 杀人 + 10 分
      scoreItem += stats.kills * 10;
      // 助攻 +5 分
      scoreItem += stats.assists * 5;
      // 死亡 - 8 分
      scoreItem -= stats.deaths * 8;

      // 补兵 每分钟8个刀以上加5分 ,9+10, 10+20
      let minute_minions_killed = stats.totalMinionsKilled / (game.gameDuration / 60);
      if (minute_minions_killed > 10) {
        scoreItem += 20;
      } else if (minute_minions_killed > 9) {
        scoreItem += 10;
      } else if (minute_minions_killed > 8) {
        scoreItem += 5;
      }

      // 总英雄伤害加分
      scoreItem += stats.totalDamageDealtToChampions / 1500;

      // 防御塔伤害加分
      scoreItem += stats.damageDealtToTurrets / 1000;

      // 水晶伤害
      scoreItem += stats.damageDealtToObjectives / 1000;
      
      // 排位外只加60%
      if (![420, 440].includes(game.queueId)) {
        scoreItem *= 0.6;
      }

      // 时间按照 25分钟 100% 超出和缺少的时间百分比权衡
      score *= (1 + (25 - (game.gameDuration / 60)) / 100);
      score += scoreItem;
    }

    // 均衡到20场
    if (games.length != 20) {
      score = (score / games.length) * 20;
    }
    return Math.ceil(score);
  }
}