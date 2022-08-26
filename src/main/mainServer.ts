import { interval, take } from 'rxjs';
import { HttpApiClient } from './api/httpclient';
import { WebSockeClient } from './api/wsclient';
import { LCUProcessSearcher } from './processSearcher';
import { MainWindowFactory } from './windowFactory';

export class Horserace {

  static async create() {
    return new Horserace({
      mainWindow: new MainWindowFactory().create(),
      ...await new LCUProcessSearcher().findCommanderFlagsUntil(),
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

  async ipcListen() {

    // 等待接收对局状态 
    // 自动接受对局
    this.webSocketClient.on('readyCheck', async () => {
      await this.httpClient.acceptCurrentMatch();
    });

    // 英雄选择状态
    // 查询我方战力
    this.webSocketClient.on('ChampSelect', async (payload) => {
      console.log('ChampSelect')
      console.log(payload);
    });

    // 游戏开始时查询敌方战力
    this.webSocketClient.on('GameStart', async (payload) => {
      console.log('GameStart')
      console.log(payload);
    });

    // 游戏结算时更新用户信息
    this.webSocketClient.on('EndOfGame', async () => {
      this.mainWindow.webContents.send(
        'update-profile',
        await this.httpClient.findCurrentSummoner()
      );
    });

    // 展示用户信息
    interval(1000).pipe(take(5)).subscribe(async () => {
      this.mainWindow.webContents.send(
        'update-profile',
        await this.httpClient.findCurrentSummoner()
      );
    });

    return this;
  }
}