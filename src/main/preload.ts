const { contextBridge, ipcRenderer } = require('electron');

// 为浏览器暴露后端的api
contextBridge.exposeInMainWorld('electronAPI', {
  // 后端推送用户信息更新
  onUpdateProfile: (callback: any) => ipcRenderer.on('update-profile', callback),
})