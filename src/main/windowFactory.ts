import { join } from 'node:path';
import { BrowserWindow } from 'electron';

export class MainWindowFactory {
  create() {
    const mainWindow = new BrowserWindow({
      title: 'Horserace',
      center: true,
      show: true,
      frame: true,
      resizable: true,
      width: 250,
      height: 400,
      webPreferences: {
        preload: join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: true,
        webSecurity: false,
      },
    });

    mainWindow.setMenu(null);
    mainWindow.loadFile(join(__dirname, 'renderer/index.html'));
    mainWindow.webContents.openDevTools();
    return mainWindow;
  }
}
