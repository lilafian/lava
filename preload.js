const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('setTitle', title),
    quit: () => ipcRenderer.send('quit'),
    getVersion: () => ipcRenderer.invoke('getVersion'),
    getExtensions: (debug) => ipcRenderer.invoke('get-extensions', debug), // Add this line
    onInterceptedUrl: (callback) => ipcRenderer.on('intercepted-url', callback),
    onFullscreenChange: (callback) => ipcRenderer.on('fullscreen-change', callback)
});
