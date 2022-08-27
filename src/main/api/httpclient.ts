import { Agent } from 'https';
import axios, { AxiosInstance } from 'axios';
import { GameflowSession } from '../types/gameFlowSession';
import { Matchlist } from '../types/matchs';
import { Conversation, ConversationMsg } from '../types/conversation';
import { Summoner } from '../types/summoner';
import { PerformanceJudger } from '../performance';

export class HttpApiClient {
  constructor(options: { password: string, port: string }) {
    this.httpClient = axios.create({
      baseURL: `https://riot:${options.password}@127.0.0.1:${options.port}`,
      httpsAgent: new Agent({ rejectUnauthorized: false }),
    });
  }
  private readonly httpClient: AxiosInstance;

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
  async findSummonerEffect(id: number | string) {
    const matchs = await this.findSummonerMatchs(id);
    const judger = new PerformanceJudger(matchs.games.games);
    return {
      score: judger.score,
      label: judger.label,
    }
  }

  /**
   * 查询召唤师历史战绩
   */
  async findSummonerMatchs(id: number | string) {
    const { data } = await this.httpClient.get<Matchlist>(
      `/lol-match-history/v3/matchlist/account/${id}`,
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
}