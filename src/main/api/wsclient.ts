import { EventEmitter, WebSocket } from 'ws';
import { Agent } from 'https';

export class WebSockeClient extends EventEmitter {
  constructor(options: { password: string, port: string }) {
    super();

    this.webSocketClient = new WebSocket(
      `wss://riot:${options.password}@127.0.0.1:${options.port}`,
      {
        agent: new Agent({ rejectUnauthorized: false }),
      }
    );

    this.webSocketClient.on('open', () => {
      this.webSocketClient.send(JSON.stringify([5, 'OnJsonApiEvent']));
    });

    this.webSocketClient.on('message', async (message) => {
      const payload = this.jsonParse(message);
      if (payload === null) {
        return;
      }

      // 匹配事件类型
      switch (payload.uri) {
        case '/lol-gameflow/v1/gameflow-phase':
          switch (payload.data) {
            case 'ReadyCheck':
              this.emit('readyCheck', payload);
              break
            case 'GameStart':
              this.emit('GameStart', payload);
              break;
            case 'EndOfGame':
              this.emit('EndOfGame', payload);
              break;
            case 'ChampSelect':
              this.emit('ChampSelect', payload);
              break;
          }
          break;
      }
    });
  }

  private readonly webSocketClient: WebSocket;

  private jsonParse(message: any) {
    try {
      const [code, topic, packet] = JSON.parse(message);
      return packet;
    } catch (e) {
      return null;
    }
  }
}