import { app } from 'electron';
import { Horserace } from './mainServer';

async function main() {
  app.whenReady()
    .then(() => Horserace.create())
    .then(server => server.ipcListen())  
}

main();