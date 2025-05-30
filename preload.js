const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title) => ipcRenderer.send("setTitle", title),
  quit: () => ipcRenderer.send("quit"),
  getVersion: () => ipcRenderer.invoke("getVersion"),
  getExtensions: () => ipcRenderer.invoke("get-extensions"),
  getBookmarks: () => ipcRenderer.invoke("get-bookmarks"),
  addBookmark: () => ipcRenderer.invoke("add-bookmark", title, url),
  getSettings: () => ipcRenderer.invoke("get-settings"),
  setSetting: (setting, value) =>
    ipcRenderer.invoke("set-setting", setting, value),
  clearData: () => ipcRenderer.invoke("clear-data"),
  toggleBrowserDevTools: () =>
    ipcRenderer.invoke("toggle-dev-tools"),
  reloadBrowser: () => ipcRenderer.invoke("reload"),
  onInterceptedUrl: (callback) => ipcRenderer.on("intercepted-url", callback),
  onFullscreenChange: (callback) =>
    ipcRenderer.on("fullscreen-change", callback),
});
