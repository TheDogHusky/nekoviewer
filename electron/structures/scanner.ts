import type App from "#electron/structures/app";
import { readdir, copyFile } from "node:fs/promises";
import {
    EXTENSIONS,
    MANGA_VOLUME_FILE_NAME_REGEX,
    MANGA_VOLUME_FILE_NAME_WITH_MANGA_NAME_REGEX,
    DIRECTORY_MANGA_NAME_REGEX, IMAGE_EXTENSIONS
} from "#electron/utils/constants";
import { normalizeMangaName } from "#electron/utils/functions";

class MangaScanner {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    async scan(directory: string, onProgress: (percent: number) => void): Promise<void> {
        const files = await readdir(directory, { withFileTypes: true });

        let mangaName = this.findMangaName(directory + "/" + files[0]?.name);
        if (mangaName) {
            console.log(`(scanner) Found manga: ${mangaName}`);
        }

        for await (const file of files) {
            // if we haven't found the manga name yet, we will try to find it from the current file or directory
            if (!mangaName) {
                mangaName = this.findMangaName(directory + "/" + file.name);
                if (mangaName) {
                    console.log(`(scanner) Found manga: ${mangaName}`);
                }
            }

            // if the file is a directory, we will scan it recursively
            if (file.isDirectory()) {
                const subDir = `${directory}/${file.name}`;
                await this.scan(subDir, onProgress);
            }

            // if the file is indeed a volume file (matches our supported extensions), we process it
            const path = `${directory}/${file.name}`;
            const ext = path.split(".").pop()?.toLowerCase();
            if (!ext) continue;

            if (ext in EXTENSIONS) {

            } else if (ext in IMAGE_EXTENSIONS) {
                // if it's an image file, this means we found the cover image, saving it!
                await this.processCoverImage(path, mangaName);
            }

        }
    }

    /**
     * Find the manga name from the file path. It will try to find the manga name from the file name first, if it doesn't find it, it will try to find it from the directory name. If it still doesn't find it, it will return an empty string.
     * @param filePath The file path to find the manga name from.
     * @return The manga name if found, otherwise an empty string.
     */
    findMangaName(filePath: string): string {
        const parts = filePath.split("/");
        // if the file path only contains the directory, try to find the manga name from the directory name
        if (parts.length === 1) {
            const dirName = parts[0];
            // we should verify if the directory name contains the manga name by checking if it matches the regex with manga name, if it doesn't match, we will return an empty string
            const match = dirName?.match(DIRECTORY_MANGA_NAME_REGEX);
            if (!match) {
                return "";
            }

            return normalizeMangaName(dirName);
        }
        const fileName = parts.pop() || "";
        const dirName = parts.pop() || "";

        const matchWithMangaName = fileName.match(MANGA_VOLUME_FILE_NAME_WITH_MANGA_NAME_REGEX);
        // if the file name matches the regex with manga name, it means the volumes contains the manga name
        if (matchWithMangaName) {
            return normalizeMangaName(matchWithMangaName[1]);
        }

        const matchWithoutMangaName = fileName.match(MANGA_VOLUME_FILE_NAME_REGEX);
        // if the file name matches the regex without manga name, it means the volumes doesn't contain the manga name, so we will try to find the manga name from the directory name
        if (matchWithoutMangaName) {
            return normalizeMangaName(dirName);
        }

        // if the file name doesn't match any of the regex, it means it's not a valid manga volume file, so we will return an empty string
        return "";
    }

    async processVolumeFile(filePath: string): Promise<void> {}

    async processCoverImage(filePath: string, mangaName?: string): Promise<void> {
        if (!mangaName) {
            mangaName = this.findMangaName(filePath);
            if (!mangaName) {
                console.warn(`(scanner) Could not find manga name while processing cover image. Skipping cover image: ${filePath}`);
                return;
            }
        }
        const mangaDirectory = this.app.userDataFolder + "/mangas" + "/" + mangaName;
        // we will save the cover image in the manga directory with the name "cover" and the same extension as the original file
        const ext = filePath.split(".").pop()?.toLowerCase();
        if (!ext) {
            console.warn(`(scanner) Could not find file extension while processing cover image. Skipping cover image: ${filePath}`);
            return;
        }
        const coverPath = `${mangaDirectory}/cover.${ext}`;
        // we will copy the cover image to the manga directory
        await copyFile(filePath, coverPath);
        console.log(`(scanner) Cover image saved: ${coverPath}`);
    }
}