import { WebSocket } from 'ws';
import { Agent } from 'https';
import { EventEmitter } from 'events';
import { Service } from 'typedi';
import { Stage } from '../types/stage';
import { LCUProcessUtil } from '../lcuProcessUtil';
import { GameflowSession } from '../types/gameFlowSession';
import { Matchlist } from '../types/matchs';
import { Conversation, ConversationMsg } from '../types/conversation';
import { Summoner } from '../types/summoner';
import { RankedStats } from '../types/rank';
import { SummonerEffect } from '../types/summonerEffect';
import { Action, ChampSelectSession } from '../types/champSelectSession';
import { PerformanceJudger } from '../performance';
import axios, { AxiosInstance } from 'axios';

@Service()
export class LCUClient {
  constructor(private readonly lCUProcessUtil: LCUProcessUtil) {
    lCUProcessUtil.onExit(() => this.cleanConnect())
    lCUProcessUtil.onExec(({ httpBaseURL, wsBaseURL }) => {
      this.httpClient = this.createHttpConnect(httpBaseURL);
      this.webSocketClient = this.createWSConnect(wsBaseURL);
    });
    this.eventEmitter = new EventEmitter();
  }

  private cleanConnect() {
    this.webSocketClient?.removeAllListeners();
    if (this.webSocketClient?.readyState === 1) {
      this.webSocketClient.close();
    }
    this.httpClient = null;
    this.webSocketClient = null;
  }

  private createHttpConnect(httpBaseURL: string) {
    return axios.create({
      baseURL: httpBaseURL,
      httpsAgent: new Agent({
        keepAlive: true,
        rejectUnauthorized: false,
      }),
    });
  }

  private createWSConnect(wsBaseURL: string) {
    const ws = new WebSocket(wsBaseURL,
      {
        agent: new Agent({ 
          rejectUnauthorized: false,
          keepAlive: true,
        }),
      }
    );

    ws.on('open', () => {
      this.webSocketClient.send(
        JSON.stringify([5, 'OnJsonApiEvent'])
      );
      this.eventEmitter.emit('Connected');
    });

    ws.on('message', async (message) => {
      const payload = this.jsonParse(message);
      if (payload?.uri === '/lol-gameflow/v1/gameflow-phase') {
        this.stage = payload.data;
        this.eventEmitter.emit(payload.data, payload);
      }
    });
    return ws;
  }


  private eventEmitter: EventEmitter;
  private webSocketClient: WebSocket;
  private httpClient: AxiosInstance;
  public stage: Stage = Stage.Lobby;

  private jsonParse(message: any) {
    try {
      const [code, topic, packet] = JSON.parse(message);
      return packet;
    } catch (e) {
      return null;
    }
  }

  on(event: keyof typeof Stage | 'Connected', fn: any) {
    this.eventEmitter.on(event, fn);
  }

  /**
   * 接受当前对局
  */
  acceptMatch() {
    return this.httpClient.post(
      '/lol-matchmaking/v1/ready-check/accept',
      null,
    );
  }

  /**
   * 查询当前登录者信息
   */
  async findCurrentSummoner() {
    const { data } = await this.httpClient.get<Summoner>(
      '/lol-summoner/v1/current-summoner',
    );
    return data;
  }

  /**
   * 查询当前登录者信息
   */
  async findOneSummoner(id: string | number) {
    const { data } = await this.httpClient.get<Summoner>(
      `/lol-summoner/v1/summoners/${id}`,
    );
    return data;
  }

  /**
   * 查询召唤师战力
   */
  async findSummonerEffect(id: number | string): Promise<SummonerEffect> {
    const summoner = await this.findOneSummoner(id);
    const matchs = await this.findSummonerMatchs(id);
    return {
      summonerName: summoner.displayName,
      games: matchs.games.games.reverse(),
      horse: new PerformanceJudger().parse(matchs.games.games),
      rank: await this.findSummonerRank(summoner.puuid),
    };
  }

  /**
   * 查询召唤师历史战绩
   */
  async findSummonerMatchs(accountId: number | string, begIndex = 0, endIndex = 20) {
    const { data } = await this.httpClient.get<Matchlist>(
      `/lol-match-history/v3/matchlist/account/${accountId}`,
      {
        params: { begIndex, endIndex },
      }
    );
    return data;
  }

  /**
   * 获取当前聊天组内的召唤师
   */
  async findConversationSummoners() {
    const conversations = await this.httpClient.get<Conversation[]>(
      '/lol-chat/v1/conversations',
    );
    const conversation = conversations.data.find(
      (i: any) => i.type === 'championSelect',
    );
    if (!conversation) {
      return []
    }

    // 查找聊天室内的信息
    const messages = await this.httpClient.get<ConversationMsg[]>(
      `/lol-chat/v1/conversations/${conversation.id}/messages`,
    );

    // 通过历史信息查到当前聊天室内的召唤师ID
    const summonersIds = Array.from(
      new Set(messages.data.map(v => v.fromSummonerId))
    );
    // 通过召唤师ID查询召唤师信息
    return await Promise.all(summonersIds.map(v => this.findOneSummoner(v)));
  }

  /**
   * 获取召唤师段位
   */
  async findSummonerRank(puuid: string) {
    const { data } = await this.httpClient.get<RankedStats>(
      `/lol-ranked/v1/ranked-stats/${puuid}`,
    );

    const tierZhMap: Record<string, string> = {
      NONE: '未定级',
      CHALLENGER: '王者',
      GRANDMASTER: '宗师',
      MASTER: '大师',
      DIAMOND: '钻石',
      PLATINUM: '铂金',
      GOLD: '黄金',
      SILVER: '白银',
      BRONZE: '青铜',
      IRON: '黑铁',
    };

    return {
      flexSR: {
        tier: data.queueMap.RANKED_FLEX_SR.tier,
        tierZh: tierZhMap[data.queueMap.RANKED_FLEX_SR.tier],
        division: data.queueMap.RANKED_FLEX_SR.division,
        leaguePoints: data.queueMap.RANKED_FLEX_SR.leaguePoints,
      },
      solo5x5: {
        tier: data.queueMap.RANKED_SOLO_5x5.tier,
        tierZh: tierZhMap[data.queueMap.RANKED_SOLO_5x5.tier],
        division: data.queueMap.RANKED_SOLO_5x5.division,
        leaguePoints: data.queueMap.RANKED_SOLO_5x5.leaguePoints,
      }
    }
  }

  /**
   * 获取当前游戏流程信息
   */
  async findGameflowSession() {
    const { data } = await this.httpClient.get(
      '/lol-gameflow/v1/session'
    );
    return (data as GameflowSession).gameData;
  }

  /**
   * 查询召唤师历史战绩
   */
  async findGames(id: number | string) {
    const { data } = await this.httpClient.get(
      `/lol-match-history/v3/matchlist/account/${id}`,
    );
    const matchlist = data as Matchlist;
    return matchlist.games.games;
  }

  /**
   * 获取选人/办人会话
   */
  private async findChampSelectSession() {
    const { data } = await this.httpClient.get<ChampSelectSession>(
      `/lol-champ-select/v1/session`,
    );
    return data;
  }

  /**
   * 获取选人/办人会话中，自己的操作ID
   */
  async findChampSelectAction() {
    const result: { pick?: Action, ban?: Action } = {};
    const champSelectSession = await this.findChampSelectSession();

    // 从选择会话中获取自身召唤师的 action
    for (const action of champSelectSession.actions) {
      for (const item of action) {
        if (
          item.actorCellId == champSelectSession.localPlayerCellId
          && item.isInProgress
          && !item.completed
        ) {
          result[item.type] = item;
        }
      }
    }
    return result;
  }

  /**
   *  选择或者禁用英雄共用函数
   */
  updateChampSelectAction(action: Action, champId: number) {
    // 通过 action.id 触发操作
    return this.httpClient.patch(
      `/lol-champ-select/v1/session/actions/${action.id}`,
      {
        completed: true,
        type: action.type,
        championId: champId
      }
    )
      .then(() => true)
      .catch(() => false);
  }
}