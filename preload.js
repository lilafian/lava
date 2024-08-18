const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('setTitle', title),
    quit: () => ipcRenderer.send('quit'),
    getVersion: () => ipcRenderer.invoke('getVersion')
})