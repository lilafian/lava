console.log("-----> Starting Lava...");

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require("fs").promises;
const envPaths = require("env-paths");
const os = require("os");

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
    });

    ipcMain.on('quit', () => {
        app.quit();
    });

    // IPC handler for getting extensions
    ipcMain.handle('get-extensions', async (event, debug) => {
        return await getExtensions(debug); // Call your function and return the result
    });

    win.loadFile(path.join(__dirname, 'frontend/index.html'));

    console.log("-----> Window created successfully!");

    win.webContents.on("did-attach-webview", (event, webContents) => {
        console.log("-----> Webview attached! User-Agent: " + webContents.userAgent);
        
        webContents.setWindowOpenHandler(({ url }) => {
            console.log("-----> Intercepted URL:", url);
            win.webContents.send('intercepted-url', url);
            return { action: 'deny' };
        });
    });

    win.on('enter-full-screen', () => {
        console.log("-----> Entering fullscreen");
        win.webContents.send('fullscreen-change', true);
    });

    win.on('leave-full-screen', () => {
        console.log("-----> Leaving fullscreen");
        win.webContents.send('fullscreen-change', false);
    });

    // win.removeMenu();
}

async function getExtensions(debug = false) {
    let basePath;
    if (debug) {
        basePath = path.join(os.homedir(), 'projects', 'lava');
    } else {
        const paths = envPaths('lava');
        basePath = paths.config;
    }
  
    const extensionsPath = path.join(basePath, 'extensions');
    const clientPath = path.join(extensionsPath, 'client');
    const webPath = path.join(extensionsPath, 'web');
  
    // Create directories if they don't exist
    await fs.mkdir(extensionsPath, { recursive: true });
    await fs.mkdir(clientPath, { recursive: true });
    await fs.mkdir(webPath, { recursive: true });
  
    const result = {
        client: {},
        web: {}
    };
  
    async function processSubfolders(basePath, target) {
        const subfolders = await fs.readdir(basePath, { withFileTypes: true });
        
        for (const dirent of subfolders) {
            if (dirent.isDirectory()) {
                const folderPath = path.join(basePath, dirent.name);
                const metadataPath = path.join(folderPath, 'metadata.json');
                const entryPath = path.join(folderPath, 'entry.js');
                
                try {
                    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
                    const metadata = JSON.parse(metadataContent);
                    
                    if (metadata.id) {
                        // Read the content of entry.js
                        try {
                            const entryContent = await fs.readFile(entryPath, 'utf-8');
                            metadata.exec = entryContent;
                        } catch (entryError) {
                            console.error(`Error reading entry.js for ${metadata.id}:`, entryError.message);
                            metadata.exec = null; // or you could set it to an empty string if you prefer
                        }
  
                        target[metadata.id] = metadata;
                    }
                } catch (error) {
                    // If metadata.json doesn't exist or is invalid, skip this subfolder
                    console.error(`Error processing ${metadataPath}:`, error.message);
                }
            }
        }
    }
  
    await processSubfolders(clientPath, result.client);
    await processSubfolders(webPath, result.web);
  
    return result;
}

app.whenReady().then(() => {
    console.log("-----> App ready!");
    
    console.log("-----> Setting up version handler...");
    ipcMain.handle("getVersion", () => {
        return lavaVersion;
    });

    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    getExtensions()
        .then(extensions => console.log(JSON.stringify(extensions, null, 2)))
        .catch(error => console.error('Error:', error));
});

console.log("-----> Waiting for app to be ready...");

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
