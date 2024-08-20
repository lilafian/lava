console.log("-----> Starting Lava...");

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const lavaVersion = require("./package.json").version;

const createWindow = () => {
    console.log("-----> Creating Lava window...");
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            webviewTag: true,
            preload: path.join(__dirname, 'preload.js'),
            allowPopups: true,
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    ipcMain.on('setTitle', (event, title) => {
        const webContents = event.sender;
        const win = BrowserWindow.fromWebContents(webContents);
        win.setTitle(title);
    })

    ipcMain.on('quit', () => {
        app.quit();
    })

    win.loadFile(path.join(__dirname, 'frontend/index.html'));

    console.log("-----> Window created successfully!");

    win.webContents.on("did-attach-webview", (event, webContents) => {
        console.log("-----> Webview attached! User-Agent: " + webContents.userAgent);
        
        webContents.setWindowOpenHandler(({ url }) => {
            console.log("-----> Intercepted URL:", url);
            win.webContents.send('intercepted-url', url);
            return { action: 'deny' };
        });
    })

    win.on('enter-full-screen', () => {
        console.log("-----> Entering fullscreen");
        win.webContents.send('fullscreen-change', true);
    });

    win.on('leave-full-screen', () => {
        console.log("-----> Leaving fullscreen");
        win.webContents.send('fullscreen-change', false);
    });

    win.removeMenu();
}

app.whenReady().then(() => {
    console.log("-----> App ready!");
    
    console.log("-----> Setting up version handler...");
    ipcMain.handle("getVersion", () => {
        return lavaVersion;
    })

    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

console.log("-----> Waiting for app to be ready...");

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
