import { app } from 'electron';
import { Horserace } from './mainServer';
import { LCUProcessSearcher } from './processSearcher';
import { MainWindowFactory } from './windowFactory';

async function main() {
  await app.whenReady()

  const mainWindow = new MainWindowFactory().create();
  const flags = await new LCUProcessSearcher().findCommanderFlagsUntil();
  await new Horserace({ ...flags, mainWindow }).ipcListen();
}

main();