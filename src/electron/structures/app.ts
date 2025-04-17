import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import events from "../events";
import fs from "node:fs";
import Database from "./database";

process.env.APP_ROOT = path.join(__dirname, "..");

export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, ".output/public");

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, "public")
    : RENDERER_DIST;

/**
 * Main class of the application
 */
export default class App {
    public window: BrowserWindow | null = null;
    public splashWindow: BrowserWindow | null = null;
    public app: typeof app = app;
    public userDataFolder: string = app.getPath("userData");
    public db: Database = new Database(this);

    constructor() {
        this.init().catch((err) => {
            console.error("Error initializing app:", err);
        });

        app.on("window-all-closed", () => {
            if (process.platform !== "darwin") {
                app.quit();
                this.window = null;
            }
        });

        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        });

        app.whenReady().then(() => {
            this.initIpc();
            this.createWindow();
        });
    }

    async init() {
        await this.checkFirstTimeStartup();
    }

    async checkFirstTimeStartup() {
        const dbFilePath = path.join(this.userDataFolder, "data.db");
        if (!fs.existsSync(dbFilePath)) {
            // If the file doesn't exist, create it
            fs.writeFileSync(dbFilePath, "");
            await this.db.initializeOnFirstStartup();
        }
    }

    /**
     * Create the main window of the application, alongside the splash screen
     */
    createWindow() {
        this.window = new BrowserWindow({
            webPreferences: {
                preload: path.join(MAIN_DIST, "preload.js"),
            },
            width: 1224,
            height: 768,
            minWidth: 400,
            minHeight: 400,
            show: false,
            icon: path.join(__dirname, "..", "src", "public", "favicon.ico"),
            autoHideMenuBar: true,
            titleBarStyle: "hidden"
        });

        this.splashWindow = new BrowserWindow({
            width: 400,
            height: 400,
            frame: false,
            icon: path.join(__dirname, "..", "src", "public", "favicon.ico"),
            alwaysOnTop: true,
            skipTaskbar: true,
            resizable: false,
            closable: false,
        });

        this.splashWindow?.loadFile(path.join(__dirname, "..", "src", "public", "splash.html"));

        if (process.env.VITE_DEV_SERVER_URL) {
            this.window.loadURL(process.env.VITE_DEV_SERVER_URL);
            this.window.webContents.openDevTools();
        } else {
            this.window.loadFile(path.join(process.env.VITE_PUBLIC!, "index.html"));
        }

        this.window.webContents.once("did-finish-load", () => {
            this.splashWindow?.destroy();
            this.window?.show();
        });
    }

    /**
     * Initialize all IPC events
     */
    initIpc() {
        Object.entries(events).forEach(([key, value]) => {
            const eventHandler = value as EventHandler;
            ipcMain[eventHandler.type](key, (e, data) => eventHandler.func.call(this, e, data));
        });
    }
}