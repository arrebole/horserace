import { LCUClient } from './api/lcuClient';
import { sleep } from './sleep';
import { MainWindow } from './mainWindow';
import { ipcMain } from 'electron';
import { Stage } from './types/stage';
import { Service } from 'typedi';
import { Configure } from './config';

@Service()
export class Horserace {

  private constructor(
    private readonly lcuClient: LCUClient,
    private readonly mainWindow: MainWindow,
    private readonly configure: Configure,
  ) { }

  async start() {

    // 等待接收对局状态 
    // 自动接受对局
    this.lcuClient.on(Stage.ReadyCheck, async () => {
      if (this.configure.autoAcceptMatch) {
        await this.lcuClient.acceptMatch();
      }
    });

    // 英雄选择状态
    this.lcuClient.on(Stage.ChampSelect, async () => {

      await sleep(2000);

      // 获取当前聊天组内(队友)
      const summoners = await this.lcuClient.findConversationSummoners();

      // 获取组内队友战力
      const teamOne = summoners.map(v =>
        this.lcuClient.findSummonerEffect(v.summonerId),
      );

      // 发送队伍信息
      this.mainWindow.webContents.send('in-champSelect', {
        teamOne: await Promise.all(teamOne),
      });

      const completed = { ban: false, pick: false };
      // 自动 ban 人
      const banTimer: NodeJS.Timer = setInterval(async () => {
        if (this.lcuClient.stage !== Stage.ChampSelect
          || !this.configure.autoBanChampionId
          || completed.ban
        ) {
          return clearInterval(banTimer);
        }
        const action = await this.lcuClient.findChampSelectAction();
        if (action.ban) {
          completed.ban = await this.lcuClient.updateChampSelectAction(
            action.ban, 
            this.configure.autoBanChampionId,
          );
        }
      }, 3000);

      // 自动 pick 人
      const pickTimer: NodeJS.Timer = setInterval(async () => {
        if (this.lcuClient.stage !== Stage.ChampSelect
          || !this.configure.autoPickChampionId
          || completed.pick
        ) {
          return clearInterval(pickTimer);
        }
        const action = await this.lcuClient.findChampSelectAction();
        if (action.pick) {
          completed.pick = await this.lcuClient.updateChampSelectAction(
            action.pick, 
            this.configure.autoPickChampionId,
          );
        }
      }, 3000);
    });

    // 游戏开始阶段
    this.lcuClient.on(Stage.GameStart, async () => {
      const game = await this.lcuClient.findGameflowSession();
      const teamOne = game.teamOne.map(summoner =>
        this.lcuClient.findSummonerEffect(summoner.summonerId),
      );
      const teamTwo = game.teamTwo.map(summoner =>
        this.lcuClient.findSummonerEffect(summoner.summonerId),
      );
      this.mainWindow.webContents.send('in-gameStart', {
        teamOne: await Promise.all(teamOne),
        teamTwo: await Promise.all(teamTwo),
      });
    });

    // 游戏结算阶段
    this.lcuClient.on(Stage.EndOfGame, async () => {
      // 发送游戏结束事件
      // 游戏结算后更新用户信息
      this.mainWindow.webContents.send('in-EndOfGame', null);
      this.mainWindow.webContents.send('update-profile', {
        profile: await this.lcuClient.findCurrentSummoner(),
      });
    });

    // 连接 lcu 成功
    this.lcuClient.on('Connected', async ()=>{
      this.mainWindow.webContents.send('update-profile', {
        profile: await this.lcuClient.findCurrentSummoner(),
      });
    });

    // 游戏设置
    ipcMain.on('set-config', (event, config: Configure) => {
      if (config.autoAcceptMatch) {
        this.configure.autoAcceptMatch = config.autoAcceptMatch;
      }
      if (config.autoBanChampionId) {
        this.configure.autoBanChampionId = config.autoBanChampionId;
      }
      if (config.autoPickChampionId) {
        this.configure.autoPickChampionId = config.autoPickChampionId;
      }
      console.log(this.configure);
    });

    return this;
  }
}