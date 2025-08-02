import App from '../app';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { type Client } from '@libsql/client';
import path from "node:path";

export default class Database {
    public app: App;
    public file: string;
    public db: LibSQLDatabase & { $client: Client };

    constructor(app: App) {
        this.app = app;
        this.file = process.env.NODE_ENV === "development" ? "local-dev.db" : app.userDataFolder + "/data.db";
        console.log("Database file path:", path.resolve(this.file));
        this.db = drizzle("file:" + this.file);
    }

    async initialize() {
        await migrate(this.db, {
            migrationsFolder: path.join(this.app.app.getAppPath(), "drizzle")
        });
    }
}