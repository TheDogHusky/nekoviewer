import type App from "#electron/structures/app";
import { readdir } from "node:fs/promises";
import { EXTENSIONS } from "#electron/utils/constants";

class MangaScanner {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    async scan(directory: string, onProgress: (percent: number) => void): Promise<void> {
        const files = await readdir(directory, { withFileTypes: true });

        for await (const file of files) {
            if (file.isDirectory()) {
                const subDir = `${directory}/${file.name}`;
                await this.scan(subDir, onProgress);
            }
            const path = `${directory}/${file.name}`;
            const ext = path.split(".").pop()?.toLowerCase();
            if (ext && ext in EXTENSIONS) {

            }

        }
    }
}