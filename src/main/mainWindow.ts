import { join } from 'node:path';
import { BrowserWindow } from 'electron';
import { Service } from 'typedi';


@Service()
export class MainWindow {

  constructor() {
    this.mainWindow = new BrowserWindow({
      title: 'Horserace',
      center: true,
      show: true,
      frame: true,
      resizable: false,
      width: 420,
      height: 400,
      webPreferences: {
        preload: join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: true,
        webSecurity: false,
      },
    });

    this.mainWindow.setMenu(null);
    this.mainWindow.loadFile(join(__dirname, 'renderer/index.html'));
    // this.mainWindow.webContents.openDevTools();
  }
  private readonly mainWindow: BrowserWindow;

  get webContents() {
    return this.mainWindow.webContents;
  }

}