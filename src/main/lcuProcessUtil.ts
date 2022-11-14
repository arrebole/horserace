import { promisify } from 'node:util';
import { EventEmitter } from 'node:events';
import { exec } from 'node:child_process';
import { Service } from 'typedi';
import { sleep } from './sleep';

@Service()
export class LCUProcessUtil {
  private eventEmitter = new EventEmitter();

  // 查询 LCU 进程信息
  private async findCommanderFlags() {
    const { stdout } = await promisify(exec) (
      "wmic PROCESS WHERE name='LeagueClientUx.exe' GET commandline /value",
      {
        shell: 'cmd.exe',
      }
    );
    if (!stdout) {
      return null;
    }

    const pid = stdout.match(/--app-pid=(\d+)/);
    const port = stdout.match(/--app-port=(\d+)/);
    const password = stdout.match(/--remoting-auth-token=(.+?)\"/);

    if (!pid || !port || !password) {
      return null;
    }
    return {
      pid: pid[1],
      port: port[1],
      password: password[1],
    }
  }

  private password: string
  private port: string

  constructor() {
    setInterval(async () => {
      const flag = await this.findCommanderFlags();
      if (!flag) {
        this.eventEmitter.emit('disconnect', null);
        return;
      }
      if (flag.password != this.password || flag.port != this.port) {
        this.port = flag.port;
        this.password = flag.password;

        await sleep(2000);
        this.eventEmitter.emit('connect', {
          wsBaseURL: `wss://riot:${flag.password}@127.0.0.1:${flag.port}`,
          httpBaseURL: `https://riot:${flag.password}@127.0.0.1:${flag.port}`,
        });
      }
    }, 3000);
  }

  onExec(fn: (params: { wsBaseURL: string, httpBaseURL: string })=> void) {
    this.eventEmitter.on('connect', fn);
  }

  onExit(fn: ()=> void) {
    this.eventEmitter.on('disconnect', fn);
  }
}