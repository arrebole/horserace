import axios from 'axios';
import { Agent } from 'https';
import { ipcMain } from 'electron';
import type { AxiosInstance } from 'axios';

export class Horserace {

  constructor(options: {
    port: string,
    remotingAuthToken: string,
    mainWindow: Electron.CrossProcessExports.BrowserWindow
  }) {
    this.httpService = axios.create({
      baseURL: `https://127.0.0.1:${options.port}`,
      auth: {
        username: 'riot',
        password: options.remotingAuthToken,
      },
      httpsAgent: new Agent({
        rejectUnauthorized: false
      }),
    });
    this.mainWindow = options.mainWindow;
  }

  private readonly httpService: AxiosInstance;
  private readonly mainWindow: Electron.CrossProcessExports.BrowserWindow;

  ipcListen() {

    // 更新用户信息
    setInterval(async () => {
      const { data } = await this.httpService.get(
        '/lol-summoner/v1/current-summoner',
      );
      this.mainWindow.webContents.send('update-profile', data);
    }, 10 * 1000);

    // 监听游戏开始;

    return this;
  }
}