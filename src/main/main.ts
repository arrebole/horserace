import 'reflect-metadata';
import { Container } from 'typedi';
import { app } from 'electron';
import { Horserace } from './mainServer';

function main() {
  app.whenReady().then(() => Container.get(Horserace).start())
}

main();