import { BrowserWindow } from 'electron';

export class MainWindowFactory {
    create() {
        const mainWindow = new BrowserWindow({
            title: 'Horserace',
            center: true,
            show: true,
            frame: false,
            resizable: true,
            width: 400,
            height: 650,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                webSecurity: false,
            },
        });

        mainWindow.loadFile('renderer/index.html');

        mainWindow.webContents.openDevTools()

        return mainWindow;
    }
}
