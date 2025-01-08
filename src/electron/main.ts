import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';

process.env.APP_ROOT = path.join(__dirname, '..');

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, '.output/public');

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public')
    : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            preload: path.join(MAIN_DIST, 'preload.js'),
        },
        width: 1224,
        height: 768,
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'));
    }
}

function initIpc() {
    ipcMain.handle('startupInfos', () => {
        return {
            version: app.getVersion(),
            platform: process.platform,
        }
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