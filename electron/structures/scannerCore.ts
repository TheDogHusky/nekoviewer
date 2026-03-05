import { readdir, copyFile, mkdir } from "node:fs/promises";
import {
    EXTENSIONS,
    IMAGE_EXTENSIONS
} from "#electron/utils/constants";
import { exists, findMangaName } from "#electron/utils/functions";
import type { Dirent } from "node:fs";
import { join } from "node:path";
import type { MangaVolume, ScanData } from "#types/manga";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface FileData {
    file: Dirent;
    path: string;
}

interface ScanProgressData {
    percent: number;
    mangaName?: string;
    currentFile?: string;
}

export default class ScannerCore {
    private readonly appDataPath: string;

    constructor(appDataPath: string) {
        this.appDataPath = appDataPath;
    }

    /**
     * Used to find all the files throughout the directory and its subdirectories, it will return an array of file paths
     * Used in the scan() function to start the scanning process
     * @param directory
     */
    async findAllFiles(directory: string): Promise<FileData[]> {
        await this.initializeDataDirectory();

        const fsFiles = await readdir(directory, { withFileTypes: true });
        let files: FileData[] = [];

        for await (const file of fsFiles) {
            const path = join(directory, file.name);
            if (file.isDirectory()) {
                const subDirFiles = await this.findAllFiles(path);
                files = files.concat(subDirFiles);
            } else {
                files.push({ file, path });
            }
        }

        return files;
    }

    async scan(directory: string, onProgress: (data: ScanProgressData) => void): Promise<ScanData> {
        console.log(`Starting scan of directory: ${directory}`);
        await this.initializeDataDirectory();

        const files = await this.findAllFiles(directory);
        const totalFiles = files.length;

        let mangaName = findMangaName(join(directory, files[0]?.file.name || ""));
        if (mangaName) {
            console.log(`Found manga: ${mangaName}`);
        }

        const processedFiles = [];

        for await (const file of files) {
            console.log(`Processing file: ${file.file.name}`);
            // if we haven't found the manga name yet, we will try to find it from the current file or directory
            if (!mangaName) {
                mangaName = findMangaName(join(directory, file.file.name));
                if (mangaName) {
                    console.log(`Found manga: ${mangaName}`);
                }
            }

            console.log(`Current manga name: ${mangaName}`);
            // if the file is a directory, we disregard it as it should have been processed in the recursive call of findAllFiles, we only want to process files here
            if (file.file.isDirectory()) continue;

            console.log(`Checking file: ${file.file.name}`);
            // if the file is indeed a volume file (matches our supported extensions), we process it
            const path = file.path;
            const ext = path.split(".").pop()?.toLowerCase();
            console.log(`File extension: ${ext}`);
            if (!ext) continue;
            console.log(`Checking extension: ${ext}`);

            if (EXTENSIONS.includes(ext)) {
                console.log(`Found volume file: ${path}`);
                const data = await this.processVolumeFile(path, mangaName).catch((error) => {
                    console.error(`Error processing volume file: ${path}`, error);
                    return undefined;
                });
                if (data) processedFiles.push(data);
                onProgress({
                    percent: Math.round((processedFiles.length / totalFiles) * 100),
                    mangaName,
                    currentFile: file.file.name
                });
                await wait(1000);
            } else if (IMAGE_EXTENSIONS.includes(ext)) {
                // if it's an image file, this means we found the cover image, saving it!
                await this.processCoverImage(path, mangaName).catch((error) => {
                    console.error(`Error processing cover image: ${path}`, error);
                });
                onProgress({
                    percent: Math.round((processedFiles.length / totalFiles) * 100),
                    mangaName,
                    currentFile: file.file.name
                });
            }
        }

        // we will just log the processed files for now, we will implement the actual processing later
        console.log(`Processed files: ${processedFiles.length}`);
        console.dir(processedFiles);
        return {
            mangaName,
            volumes: processedFiles
        }
    }

    async processVolumeFile(filePath: string, mangaName?: string): Promise<MangaVolume & { filePath: string } | undefined> {
        mangaName = mangaName || findMangaName(filePath);
        if (!mangaName) {
            console.warn(
                `Could not find manga name while processing volume. Skipping volume: ${filePath}`,
            );
            return;
        }

        // we will just log the file path for now, we will implement the actual processing later
        console.log(`Found volume file: ${filePath}`);
        return {
            filePath,
            name: findMangaName(filePath),
            pages: 0, // we will implement the actual page counting later
            number: 0, // we will implement the actual volume number extraction later
        };
    }

    async processCoverImage(filePath: string, mangaName?: string): Promise<void> {
        mangaName = mangaName || findMangaName(filePath);
        if (!mangaName) {
            console.warn(`Could not find manga name while processing cover image. Skipping cover image: ${filePath}`);
            return;
        }

        const mangaDirectory = join(this.appDataPath, "mangas", mangaName);
        // we will save the cover image in the manga directory with the name "cover" and the same extension as the original file
        const ext = filePath.split(".").pop()?.toLowerCase();
        if (!ext) {
            console.warn(`Could not find file extension while processing cover image. Skipping cover image: ${filePath}`);
            return;
        }
        const coverPath = join(mangaDirectory, "cover." + ext)
        // we will copy the cover image to the manga directory
        await this.initializeDataDirectory(mangaName);
        await copyFile(filePath, coverPath);
        console.log(`Cover image saved: ${coverPath}`);
    }

    async initializeDataDirectory(manga?: string): Promise<void> {
        // we will create the mangas directory in the app data directory if it doesn't exist
        const mangasDirectory = join(this.appDataPath, "mangas");

        if (!await exists(mangasDirectory)) {
            await mkdir(mangasDirectory, { recursive: true });
            console.debug(`Data directory created: ${mangasDirectory}`);
        }

        if (manga) {
            // we will also create the manga directory if it doesn't exist
            const mangaDirectory = join(mangasDirectory, manga);
            if (!await exists(mangaDirectory)) {
                await mkdir(mangaDirectory, { recursive: true });
                console.debug(`Manga directory created: ${mangaDirectory}`);
            }
        }
    }
}