import { Game } from "./types/matchs";

export class PerformanceJudger {


  public recognizeHorse(games: Game[]) {
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
    if (score > 3000) {
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
      const stats = game.participants[0].stats;
      // 一血 +30 分
      if (stats.firstBloodKill) {
        score += 30;
      }
      // 一血助攻 +20 分
      if (stats.firstBloodAssist) {
        score += 20;
      }
      // 一塔 + 40
      if (stats.firstTowerKill) {
        score += 40;
      }
      // 第一个水晶
      if (stats.firstInhibitorAssist) {
        score += 50;
      }
      // 一塔助攻 + 40
      if (stats.firstTowerAssist) {
        score += 20;
      }
      // 五杀 +300
      if (stats.participantId > 0) {
        score += stats.participantId * 400;
      }
      // 四杀 +200
      if (stats.participantId > 0) {
        score += stats.participantId * 300;
      }
      // 三杀 +60
      if (stats.tripleKills > 0) {
        score += stats.tripleKills * 100;
      }
      // 赢得比赛 + 100
      if (stats.win) {
        score += 100
      }

      // 杀人 + 10 分
      score += stats.kills * 10;
      // 助攻 +7 分
      score += stats.assists * 6;
      // 死亡 - 8 分
      score -= stats.deaths * 8;

      // 补兵 每分钟8个刀以上加5分 ,9+10, 10+20
      let minute_minions_killed = stats.totalMinionsKilled / (game.gameDuration / 60);
      if (minute_minions_killed > 10) {
        score += 20;
      } else if (minute_minions_killed > 9) {
        score += 10;
      } else if (minute_minions_killed > 8) {
        score += 5;
      }

      // 总英雄伤害加分
      score += stats.totalDamageDealtToChampions / 1500;

      // 防御塔伤害加分
      score += stats.damageDealtToTurrets / 1000;

      // 水晶伤害
      score += stats.damageDealtToObjectives / 1000;

      // 治疗加分
      score += stats.totalHeal / 10000;
    }

    // 均衡到20场
    if (games.length != 20) {
      score = (score / games.length) * 20;
    }
    return Math.ceil(score);
  }
}