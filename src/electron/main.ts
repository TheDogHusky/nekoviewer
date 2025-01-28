import {app, BrowserWindow, ipcMain} from 'electron';
import path from 'node:path';
import {readdir, readFile} from 'node:fs/promises';

process.env.APP_ROOT = path.join(__dirname, '..');

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, '.output/public');

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public')
    : RENDERER_DIST;

let win: BrowserWindow | null;

function extractNumberFromFilename(filename: string): string | null {
    const match = filename.match(/\d+(\.\d+)?/);
    return match ? match[0] : null;
}

function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            preload: path.join(MAIN_DIST, 'preload.js'),
        },
        width: 1224,
        height: 768,
        minWidth: 400,
        minHeight: 400,
        show: false,
        icon: path.join(__dirname, '..', 'src', "public", "favicon.ico"),
        autoHideMenuBar: true,
        titleBarStyle: 'hidden'
    });

    const splashWindow = new BrowserWindow({
        width: 400,
        height: 400,
        frame: false,
        icon: path.join(__dirname, '..', 'src', "public", "favicon.ico"),
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        closable: false,
    });

    splashWindow.loadFile(path.join(__dirname, '..', 'src', 'public', 'splash.html'));

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'));
    }

    win.webContents.once('did-finish-load', () => {
        splashWindow.destroy();
        win?.show();
    });
}

function initIpc() {
    ipcMain.handle('startupInfos', () => {
        return {
            version: app.getVersion(),
            platform: process.platform,
        }
    });

    ipcMain.handle('getMangaData', async (event, manga: string) => {
        const files = await readdir(path.join(__dirname, "..", "src", 'public', manga)).catch(() => []);
        const coverImage = files.find(file => file.endsWith('.jpg') || file.endsWith('.png')) || '';
        const coverImagePath = `/${manga}/${coverImage}`;
        const data = await readFile(path.join(__dirname, "..", "src", 'public', manga, 'data.json'), 'utf-8').catch(() => '{}');
        const volumes = files.filter((file: string) => file.endsWith('.pdf')).map((file: string) => {
            return extractNumberFromFilename(file) || 0;
        }).sort((a, b) => parseFloat(String(a)) - parseFloat(String(b)));
        return { files, coverImagePath, data: JSON.parse(data), volumes };
    });

    ipcMain.on("minimize", () => {
        win?.minimize(); // Minimize the main window
    });

    ipcMain.on("maximize", () => {
        if (win?.isMaximized()) {
            // If the window is maximized, restore it and send an event
            win?.unmaximize();
            win?.webContents.send("restored-window");
        } else {
            // If the window is not maximized, maximize it and send an event
            win?.maximize();
            win?.webContents.send("maximized-window");
        }
    });

    ipcMain.on("close", () => {
        win?.close(); // Close the main window
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
        win = null;
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(() => {
    initIpc();
    createWindow();
});