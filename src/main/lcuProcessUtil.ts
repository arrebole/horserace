import { promisify } from 'node:util';
import { EventEmitter } from 'node:events';
import { exec } from 'node:child_process';
import { sleep } from './sleep';
import { Service } from 'typedi';

@Service()
export class LCUProcessUtil {
  private eventEmitter = new EventEmitter();

  // 查询 LCU 进程信息
  private async findCommanderFlags() {
    const { stdout } = await promisify(exec) (
      "wmic PROCESS WHERE name='LeagueClientUx.exe' GET commandline /value",
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

  // 不停的循环，直到查询到 LCU 的进程
  private async awaitFindCommanderFlags() {
    while (true) {
      const flags = await this.findCommanderFlags();
      await sleep(3000);
      if (flags) {
        return flags;
      }
    }
  }

  async refresh() {
    const flag = await this.awaitFindCommanderFlags();
    this.eventEmitter.emit('onChange', {
      wsBaseURL: `wss://riot:${flag.password}@127.0.0.1:${flag.port}`,
      httpBaseURL: `https://riot:${flag.password}@127.0.0.1:${flag.port}`
    });
    return this;
  }

  subscription(fn: (params: { wsBaseURL: string, httpBaseURL: string })=> void) {
    this.eventEmitter.on('onChange', fn);
    return this.refresh();
  }
}