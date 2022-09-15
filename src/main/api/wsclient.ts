import { EventEmitter, WebSocket } from 'ws';
import { Agent } from 'https';
import { Stage } from '../types/stage';

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
      if (payload.uri === '/lol-gameflow/v1/gameflow-phase') {
        this.stage = payload.data;
        this.emit(payload.data, payload);
      }
    });
  }

  private readonly webSocketClient: WebSocket;
  public stage: Stage = Stage.Lobby;

  private jsonParse(message: any) {
    try {
      const [code, topic, packet] = JSON.parse(message);
      return packet;
    } catch (e) {
      return null;
    }
  }

}