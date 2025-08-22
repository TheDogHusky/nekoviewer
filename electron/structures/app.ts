import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import events from "#electron/events";
import fs from "node:fs";
import Database from "#electron/structures/database";
import type { AppSettings } from "#types/app";
import { settingsTable } from "#electron/structures/database/schemas";
import { DEFAULT_SETTINGS_VALUES } from "#electron/utils/constants";
import { initializeLogging } from "#electron/utils/logger";
import type { EventHandler } from "#types/app";

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
    public settings: AppSettings = DEFAULT_SETTINGS_VALUES;

    constructor() {
        initializeLogging();

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
        await this.db.initialize();
        await this.loadSettings();
    }

    /**
     * Load settings from the database
     */
    async loadSettings() {
        const settings = await this.db.db.select().from(settingsTable);
        if (settings.length === 0) {
            console.log("No settings found in the database, initializing with default values.");
            // Initialize with default values if no settings are found
            this.settings = { ...DEFAULT_SETTINGS_VALUES };
            await this.db.db.insert(settingsTable).values(this.settings);
            console.log("Default settings initialized:", this.settings);
            return;
        }
        Object.entries(settings[0]).forEach((setting) => {
            this.settings[setting[0]] = setting[1];
        });
        console.log("Settings loaded:", this.settings);
    }

    /**
     * Update settings in the database
     * @param fields The fields to update
     * @example
     * ```typescript
     * app.updateSettings({ general: { notifications: false } });
     * ```
     */
    async updateSettings(fields: Partial<AppSettings>) {
        for (const [key, value] of Object.entries(fields)) {
            const current = this.settings[key] ?? {};
            // Deep merge if the value is an object, otherwise just set the value
            const merged = typeof value === "object" && value !== null
                ? { ...current, ...value }
                : value;
            this.settings[key] = merged;
            await this.db.db.update(settingsTable)
                .set({ [key]: JSON.stringify(merged) });
        }

        console.log("Settings updated:", this.settings);
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
        const publicDirectory = app.isPackaged ? process.env.VITE_PUBLIC! : path.join(process.env.APP_ROOT!, "app", "public");

        this.window = new BrowserWindow({
            webPreferences: {
                preload: path.join(MAIN_DIST, "preload.js"),
            },
            width: 1224,
            height: 768,
            minWidth: 400,
            minHeight: 400,
            show: false,
            icon: path.join(publicDirectory, "favicon.ico"),
            autoHideMenuBar: true,
            titleBarStyle: "hidden"
        });

        this.splashWindow = new BrowserWindow({
            width: 400,
            height: 400,
            frame: false,
            icon: path.join(publicDirectory, "favicon.ico"),
            alwaysOnTop: true,
            skipTaskbar: true,
            resizable: false,
            closable: false,
        });

        this.splashWindow?.loadFile(path.join(publicDirectory, "splash.html"));

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