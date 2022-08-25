import { promisify } from 'node:util';
import { exec } from 'node:child_process';

export class LCUProcessSearcher {

  // 查询 LCU 进程信息
  async findCommanderFlags() {
    const { stdout } = await promisify(exec)(
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
  async findCommanderFlagsUntil() {
    while (true) {
      const flags = await this.findCommanderFlags();
      if (flags) {
        return flags;
      }
      await new Promise(() =>
        setTimeout(() => Promise.resolve(), 5000),
      );
    }
  }
}