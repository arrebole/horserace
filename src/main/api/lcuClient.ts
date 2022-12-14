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
   * ??????????????????
  */
  acceptMatch() {
    return this.httpClient.post(
      '/lol-matchmaking/v1/ready-check/accept',
      null,
    );
  }

  /**
   * ???????????????????????????
   */
  async findCurrentSummoner() {
    const { data } = await this.httpClient.get<Summoner>(
      '/lol-summoner/v1/current-summoner',
    );
    return data;
  }

  /**
   * ???????????????????????????
   */
  async findOneSummoner(id: string | number) {
    const { data } = await this.httpClient.get<Summoner>(
      `/lol-summoner/v1/summoners/${id}`,
    );
    return data;
  }

  /**
   * ?????????????????????
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
   * ???????????????????????????
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
   * ????????????????????????????????????
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

    // ???????????????????????????
    const messages = await this.httpClient.get<ConversationMsg[]>(
      `/lol-chat/v1/conversations/${conversation.id}/messages`,
    );

    // ??????????????????????????????????????????????????????ID
    const summonersIds = Array.from(
      new Set(messages.data.map(v => v.fromSummonerId))
    );
    // ???????????????ID?????????????????????
    return await Promise.all(summonersIds.map(v => this.findOneSummoner(v)));
  }

  /**
   * ?????????????????????
   */
  async findSummonerRank(puuid: string) {
    const { data } = await this.httpClient.get<RankedStats>(
      `/lol-ranked/v1/ranked-stats/${puuid}`,
    );

    const tierZhMap: Record<string, string> = {
      NONE: '?????????',
      CHALLENGER: '??????',
      GRANDMASTER: '??????',
      MASTER: '??????',
      DIAMOND: '??????',
      PLATINUM: '??????',
      GOLD: '??????',
      SILVER: '??????',
      BRONZE: '??????',
      IRON: '??????',
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
   * ??????????????????????????????
   */
  async findGameflowSession() {
    const { data } = await this.httpClient.get(
      '/lol-gameflow/v1/session'
    );
    return (data as GameflowSession).gameData;
  }

  /**
   * ???????????????????????????
   */
  async findGames(id: number | string) {
    const { data } = await this.httpClient.get(
      `/lol-match-history/v3/matchlist/account/${id}`,
    );
    const matchlist = data as Matchlist;
    return matchlist.games.games;
  }

  /**
   * ????????????/????????????
   */
  private async findChampSelectSession() {
    const { data } = await this.httpClient.get<ChampSelectSession>(
      `/lol-champ-select/v1/session`,
    );
    return data;
  }

  /**
   * ????????????/?????????????????????????????????ID
   */
  async findChampSelectAction() {
    const result: { pick?: Action, ban?: Action } = {};
    const champSelectSession = await this.findChampSelectSession();

    // ?????????????????????????????????????????? action
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
   *  ????????????????????????????????????
   */
  updateChampSelectAction(action: Action, champId: number) {
    // ?????? action.id ????????????
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