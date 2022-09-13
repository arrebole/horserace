const { contextBridge, ipcRenderer } = require('electron');

// 为浏览器暴露后端的api
contextBridge.exposeInMainWorld('electronAPI', {
  // 主进程到渲染器（单向）
  onUpdateProfile: (callback: any) => ipcRenderer.on('update-profile', callback),
  onInChampSelect: (callback: any) => ipcRenderer.on('in-champSelect', callback),
  onInGameStart: (callback: any) => ipcRenderer.on('in-gameStart', callback),
  onInEndOfGame: (callback: any) => ipcRenderer.on('in-EndOfGame', callback),

  // 渲染器进程到主进程（单向）
  setAutoBanChampion: (championId: number) => ipcRenderer.send('set-AutoBanChampion', championId),
  setAutoPickChampion: (championId: number) => ipcRenderer.send('set-AutoPickChampion', championId),
  setAutoAcceptMatch: (isAcceptMatch: number) => ipcRenderer.send('set-AutoAcceptMatch', isAcceptMatch),
})