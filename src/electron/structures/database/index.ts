import App from '../app';
import { drizzle } from 'drizzle-orm/libsql';
import path from "node:path";

export default class Database {
    public app: App;
    public file: string;
    public db: any;

    constructor(app: App) {
        this.app = app;
        this.file = app.userDataFolder + "/data.db";
        this.db = drizzle(this.file);
    }

    async initializeOnFirstStartup() {
        // Check if the database file exists
        const fs = require('fs');
        if (!fs.existsSync(this.file)) {
            // If it doesn't exist, create it
            fs.writeFileSync(this.file, '');
        }

        // Initialize the database
        this.db = drizzle(this.file);

        // Run migrations
        await this.db.migrate({
            migrationsFolder: path.join(__dirname, 'migrations')
        });
    }
}