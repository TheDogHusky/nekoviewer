import { app, BrowserWindow, ipcMain } from "electron";
import type { IpcMainEvent, IpcMainInvokeEvent } from "electron";
import path from "node:path";
import events from "#electron/events";
import fs from "node:fs";
import Database from "#electron/structures/database";
import type { AppSettings } from "#types/app";
import { settingsTable } from "#electron/structures/database/schemas";
import { DEFAULT_SETTINGS_VALUES } from "#electron/utils/constants";
import { initializeLogging } from "#electron/utils/logger";
import type { EventHandler } from "#types/app";
import * as Splashscreen from "@trodi/electron-splashscreen";

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

        app.on("activate", async () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                await this.createWindow();
            }
        });

        app.whenReady().then(async () => {
            this.initIpc();
            await this.createWindow();
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
        const dbSettings: Record<string, any> = settings[0] ?? {};
        Object.entries(dbSettings).forEach(([key, value]) => {
            this.settings[key] = value;
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
    async createWindow() {
        const publicDirectory = app.isPackaged
            ? process.env.VITE_PUBLIC!
            : path.join(process.env.APP_ROOT!, "public");

        this.window = Splashscreen.initSplashScreen({
            windowOpts: {
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
                titleBarStyle: "hidden",
            },
            templateUrl: path.join(publicDirectory, "splash.html"),
            splashScreenOpts: {
                width: 400,
                height: 400,
                frame: false,
                icon: path.join(publicDirectory, "favicon.ico"),
                alwaysOnTop: true,
                skipTaskbar: true,
                resizable: false
            }
        });

        if (process.env.VITE_DEV_SERVER_URL) {
            await this.window.loadURL(process.env.VITE_DEV_SERVER_URL);
            this.window.webContents.openDevTools();
        } else {
            await this.window.loadFile(path.join(process.env.VITE_PUBLIC!, "index.html"));
        }
    }

    /**
     * Initialize all IPC events
     */
    initIpc() {
        Object.entries(events).forEach(([key, value]) => {
            const eventHandler = value as EventHandler;
            switch (eventHandler.type) {
                case 'handle':
                    ipcMain.handle(key, (event, ...args) =>
                        (eventHandler.func as any).apply(this, [event as IpcMainInvokeEvent, ...args])
                    );
                    break;
                case 'on':
                    ipcMain.on(key, (event, ...args) => (eventHandler.func as any).apply(this, [event as IpcMainEvent, ...args]));
                    break;
                case 'once':
                    ipcMain.once(key, (event, ...args) => (eventHandler.func as any).apply(this, [event as IpcMainEvent, ...args]));
                    break;
                default:
                    console.warn(`Unknown IPC handler type for ${key}: ${String((eventHandler as any).type)}`);
            }
        });
    }
}