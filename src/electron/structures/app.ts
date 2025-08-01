import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import events from "../events";
import fs from "node:fs";
import Database from "./database";
import type { AppSettings } from "../utils/types";
import { settingsTable } from "./database/schemas";

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
    public settings: { [p: string]: AppSettings[string] | undefined } = {};

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
        await this.loadSettings();
    }

    /**
     * Load settings from the database
     */
    async loadSettings() {
        const settings = await this.db.db.select().from(settingsTable);
        settings.forEach((setting) => {
            this.settings[setting.key] = setting.value;
        });
        console.log("Settings loaded:", this.settings);
    }

    /**
     * Update settings in the database
     * @param fields The fields to update
     */
    async updateSettings(fields: Partial<AppSettings>) {
        this.settings = { ...this.settings, ...fields };
        for (const [key, value] of Object.entries(fields)) {
            await this.db.db.insert(settingsTable).values({ key, value }).onConflictDoUpdate({
                target: [settingsTable.key],
                set: { value }
            });
        }
    }

    async checkFirstTimeStartup() {
        const firstStartupFilePath = app.isPackaged ? path.join(this.userDataFolder, "firstStartup") : "firstStartup";
        if (!fs.existsSync(firstStartupFilePath) || fs.readFileSync(firstStartupFilePath, "utf-8") === "true") {
            // If the file doesn't exist, it's most likely the first time the app is started
            console.log("First time startup detected. Initializing database...");
            // Create the file to indicate that the first startup has been completed
            fs.writeFileSync(firstStartupFilePath, "false");
            // Other first-time startup logic can go here, such as tours, tutorials, etc.
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
            if (process.env.NODE_ENV === "development") {
                this.window?.webContents.openDevTools({ mode: 'detach' });
            }
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