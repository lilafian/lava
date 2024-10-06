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

    ipcMain.handle('get-extensions', async (event, debug) => {
        return await getExtensions(debug);
    });

    ipcMain.handle('get-bookmarks', async (event, debug) => {
        return await getBookmarks(debug);
    });

    ipcMain.handle('add-bookmark', async (event, title, url, debug) => {
        await addBookmark(title, url, debug);
    });

    ipcMain.handle('get-settings', async (event, debug) => {
        return await getSettings(debug);
    });

    ipcMain.handle('toggle-dev-tools', async (event) => {
        console.log("DEV TOOLS OPENED !!!!!!!!!!!!!!!!!!!!!!!!! (toggled actually)")

        const webContents = event.sender;
        if (webContents.isDevToolsOpened) { // backwards idk why.  i hate electron why did i build this in electron kjklj;khjkljlk
            console.log("dev tools are closed, opening");
            webContents.openDevTools();
        } else {
            console.log("dev tools are open, closing");

            webContents.closeDevTools();
        }
    });

    ipcMain.handle('reload', async (event) => {
        const webContents = event.sender;
        webContents.reload();
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

    win.removeMenu();
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
        client: {}
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
                            metadata.exec = null;
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

async function getBookmarks(debug = false) {
    let basePath;
    if (debug) {
        basePath = path.join(os.homedir(), 'projects', 'lava');
    } else {
        const paths = envPaths('lava');
        basePath = paths.config;
    }

    let dataPath = path.join(basePath, 'data');
    

    try {
        const bookmarksJson = await fs.readFile(path.join(dataPath, "bookmarks.json"), 'utf-8');
        return JSON.parse(bookmarksJson);
    } catch (err) {
        console.error(`Error reading bookmarks`, err.message);
        return {};
    }
}

async function addBookmark(title, url, debug = false) {
    let basePath;
    if (debug) {
        basePath = path.join(os.homedir(), 'projects', 'lava');
    } else {
        const paths = envPaths('lava');
        basePath = paths.config;
    }

    let dataPath = path.join(basePath, 'data');
    

    try {
        const bookmarksJson = await fs.readFile(path.join(dataPath, "bookmarks.json"), 'utf-8');
        let bookmarks = JSON.parse(bookmarksJson);
        let newBookmark = {title: title, url: url};
        bookmarks.bookmarks.push(newBookmark);
        await fs.writeFile(path.join(dataPath, "bookmarks.json"), JSON.stringify(bookmarks, null, 2));
        console.log(`Created bookmark ${title} with url ${url} successfully`);
    } catch (err) {
        console.error(`Error adding bookmark ${title}: `, err.message);
    }
}

async function getSettings(debug = false) {
    let basePath;
    if (debug) {
        basePath = path.join(os.homedir(), 'projects', 'lava');
    } else {
        const paths = envPaths('lava');
        basePath = paths.config;
    }

    let dataPath = path.join(basePath, 'data');
    

    try {
        const settingsJson = await fs.readFile(path.join(dataPath, "settings.json"), 'utf-8');
        return JSON.parse(settingsJson);
    } catch (err) {
        console.error(`Error reading settings`, err.message);
        return {};
    }
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

    getExtensions(true)
        .then(extensions => console.log("-----> Extensions:", JSON.stringify(extensions, null, 2)))
        .catch(error => console.error('EXTENSIONS Error:', error));

    getBookmarks(true)
        .then(bookmarks => console.log("-----> Bookmarks:", JSON.stringify(bookmarks, null, 2)))
        .catch(error => console.error('BOOKMARKS Error:', error));

    getSettings(true)
        .then(bookmarks => console.log("-----> Settings:", JSON.stringify(bookmarks, null, 2)))
        .catch(error => console.error('SETTINGS Error:', error));
});

console.log("-----> Waiting for app to be ready...");

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
