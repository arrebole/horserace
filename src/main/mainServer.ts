import { interval, take } from 'rxjs';
import { HttpApiClient } from './api/httpclient';
import { WebSockeClient } from './api/wsclient';
import { LCUProcessSearcher } from './processSearcher';
import { sleep } from './sleep';
import { MainWindowFactory } from './windowFactory';
import { ipcMain } from 'electron';
import { Stage } from './types/stage';

export class Horserace {

  static async create() {
    return new Horserace({
      mainWindow: new MainWindowFactory().create(),
      ...await new LCUProcessSearcher().awaitFindCommanderFlags(),
    })
  }

  private constructor(options: {
    port: string,
    password: string,
    mainWindow: Electron.CrossProcessExports.BrowserWindow
  }) {
    this.httpClient = new HttpApiClient(options)
    this.webSocketClient = new WebSockeClient(options);
    this.mainWindow = options.mainWindow;
  }

  private readonly httpClient: HttpApiClient;
  private readonly webSocketClient: WebSockeClient;
  private readonly mainWindow: Electron.CrossProcessExports.BrowserWindow;

  private autoPickChampionId: number;
  private autoBanChampionId: number;
  private autoAcceptMatch = true;

  async ipcListen() {

    // 等待接收对局状态 
    // 自动接受对局
    this.webSocketClient.on(Stage.ReadyCheck, async () => {
      if (this.autoAcceptMatch) {
        await this.httpClient.acceptMatch();
      }
    });

    // 英雄选择状态
    this.webSocketClient.on(Stage.ChampSelect, async () => {
      /************************** 自动获取队友战绩 *********************************** */

      await sleep(2000);

      // 获取当前聊天组内(队友)
      const summoners = await this.httpClient.findConversationSummoners();

      // 获取组内队友战力
      const teamOne = summoners.map(v =>
        this.httpClient.findSummonerEffect(v.summonerId),
      );

      // 发送队伍信息
      this.mainWindow.webContents.send('in-champSelect', {
        teamOne: await Promise.all(teamOne),
      });


      let banCompleted = false;
      let pickCompleted = false;

      const timer: NodeJS.Timer = setInterval(async () => {
        if (this.webSocketClient.stage !== Stage.ChampSelect) {
          return clearInterval(timer);
        }
        if (this.autoBanChampionId && !banCompleted) {
          const action = await this.httpClient.findChampSelectAction('ban');
          if (action && await this.httpClient.updateChampSelectAction(action, this.autoBanChampionId)) {
            banCompleted = true;
          }
        }
        if (this.autoPickChampionId && !pickCompleted) {
          const action = await this.httpClient.findChampSelectAction('pick');
          if (action && await this.httpClient.updateChampSelectAction(action, this.autoPickChampionId)) {
            pickCompleted = true;
          }
        }
      }, 3000);

    });

    // 游戏开始阶段
    this.webSocketClient.on(Stage.GameStart, async () => {
      const game = await this.httpClient.findGameflowSession();
      const teamOne = game.teamOne.map(summoner =>
        this.httpClient.findSummonerEffect(summoner.summonerId),
      );
      const teamTwo = game.teamTwo.map(summoner =>
        this.httpClient.findSummonerEffect(summoner.summonerId),
      );
      this.mainWindow.webContents.send('in-gameStart', {
        teamOne: await Promise.all(teamOne),
        teamTwo: await Promise.all(teamTwo),
      });
    });

    // 游戏结算阶段
    this.webSocketClient.on(Stage.EndOfGame, async () => {
      // 发送游戏结束事件
      // 游戏结算后更新用户信息
      this.mainWindow.webContents.send('in-EndOfGame', null);
      this.mainWindow.webContents.send('update-profile', {
        profile: await this.httpClient.findCurrentSummoner(),
      });
    });

    ipcMain.on('set-AutoPickChampion', (event, championId: number) => {
      this.autoPickChampionId = championId;
    });

    ipcMain.on('set-AutoBanChampion', (event, championId: number) => {
      this.autoBanChampionId = championId;
    });

    ipcMain.on('set-AutoAcceptMatch', (event, autoAcceptMatch: number) => {
      this.autoAcceptMatch = autoAcceptMatch == 0 ? false : true;
    });

    // 展示用户信息
    interval(1000).pipe(take(3)).subscribe(async () => {
      this.mainWindow.webContents.send('update-profile', {
        profile: await this.httpClient.findCurrentSummoner(),
      });
    });

    return this;
  }
}