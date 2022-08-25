import axios from 'axios';
import { WebSocket } from 'ws';
import { Agent } from 'https';
import type { AxiosInstance } from 'axios';
import { interval } from 'rxjs';

export class Horserace {

  constructor(options: {
    port: string,
    remotingAuthToken: string,
    mainWindow: Electron.CrossProcessExports.BrowserWindow
  }) {
    // http 客户端
    this.httpClient = axios.create({
      baseURL: `https://riot:${options.remotingAuthToken}@127.0.0.1:${options.port}`,
      httpsAgent: new Agent({ rejectUnauthorized: false }),
    });

    // websocket 客户端
    this.webSocketClient = new WebSocket(
      `wss://riot:${options.remotingAuthToken}@127.0.0.1:${options.port}`,
      {
        agent: new Agent({ rejectUnauthorized: false }),
      }
    );
    this.mainWindow = options.mainWindow;
  }

  private readonly httpClient: AxiosInstance;
  private readonly webSocketClient: WebSocket;
  private readonly mainWindow: Electron.CrossProcessExports.BrowserWindow;

  async ipcListen() {

    this.webSocketClient.on('open', () => {
      this.webSocketClient.send(JSON.stringify([5, 'OnJsonApiEvent']));
    });

    this.webSocketClient.on('message', async (message) => {
      try {
        // @ts-ignore
        const [n, event, packet] = JSON.parse(message);
        switch (packet.uri) {
          case '/lol-gameflow/v1/gameflow-phase':
            // 匹配完成事件，自动接受对局 
            if (packet.data === 'ReadyCheck') {
              await this.httpClient.post(
                '/lol-matchmaking/v1/ready-check/accept',
                null,
              );
            }
            break;
        }
      } catch (e) { }
    });

    // 定时任务
    // 更新用户信息
    interval(10 * 1000).subscribe(async (n) => {
      const { data } = await this.httpClient.get(
        '/lol-summoner/v1/current-summoner',
      );
      this.mainWindow.webContents.send('update-profile', data);
    });

    return this;
  }
}