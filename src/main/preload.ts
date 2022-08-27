const { contextBridge, ipcRenderer } = require('electron');

// 为浏览器暴露后端的api
contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateProfile: (callback: any) => ipcRenderer.on('update-profile', callback),
  onInChampSelect: (callback: any) => ipcRenderer.on('in-champSelect', callback),
  onInGameStart: (callback: any) => ipcRenderer.on('in-gameStart', callback),
  onInEndOfGame: (callback: any) => ipcRenderer.on('in-EndOfGame', callback),
})