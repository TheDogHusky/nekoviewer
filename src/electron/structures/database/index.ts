import App from '../app';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { type Client } from '@libsql/client';
import path from "node:path";
import { settingsTable } from "./schemas";
import fs from "node:fs";
import { eq } from 'drizzle-orm';

export default class Database {
    public app: App;
    public file: string;
    public db: LibSQLDatabase & { $client: Client };

    constructor(app: App) {
        this.app = app;
        this.file = process.env.NODE_ENV === "development" ? "../local-env.db" : app.userDataFolder + "/data.db";
        this.db = drizzle("file:" + this.file);
    }

    async initializeOnFirstStartup() {
        // Check if the database file exists
        if (!fs.existsSync(this.file)) {
            // If it doesn't exist, create it
            fs.writeFileSync(this.file, '');
        }

        // Run migrations
        console.log("Running migrations...");
        await migrate(this.db, {
            migrationsFolder: path.join(__dirname, "..", "src", "electron", "structures", "database", 'migrations')
        });
        console.log("Migrations completed.");
    }
}