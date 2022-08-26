import { Agent } from 'https';
import axios, { AxiosInstance } from 'axios';
import { GameFlowSessionData } from '../types/gameFlowSession';
import { Matchlist } from '../types/matchlist';

export class HttpApiClient {
  constructor(options: { password: string, port: string }) {
    this.httpClient = axios.create({
      baseURL: `https://riot:${options.password}@127.0.0.1:${options.port}`,
      httpsAgent: new Agent({ rejectUnauthorized: false }),
    });
  }
  private readonly httpClient: AxiosInstance;

  /**
   * 查询当前登录者信息
   */
  async findCurrentSummoner() {
    const { data } = await this.httpClient.get(
      '/lol-summoner/v1/current-summoner',
    );
    return data;
  }

  /**
   * 接受当前对局
   */
  acceptCurrentMatch() {
    return this.httpClient.post(
      '/lol-matchmaking/v1/ready-check/accept',
      null,
    );
  }

  /**
   * 获取当前游戏流程信息
   */
  async findGameFlowSession() {
    const { data } = await this.httpClient.get(
      '/lol-gameflow/v1/session'
    );
    return data.gameData as GameFlowSessionData;
  }

  /**
   * 查询召唤师历史战绩
   */
  async findSummonerGames(id: number | string){
    const { data } = await this.httpClient.get(
      `/lol-match-history/v3/matchlist/account/${id}`,
    );
    const matchlist = data as Matchlist;
    return matchlist.games.games;
  }
}