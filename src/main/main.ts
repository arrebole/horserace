import { app } from 'electron';
import { MainWindowFactory } from './windowFactory';

function main() {
  app.whenReady()
    .then(() => new MainWindowFactory().create())
}

main();