import {
    DIRECTORY_MANGA_NAME_REGEX,
    MANGA_VOLUME_FILE_NAME_WITH_MANGA_NAME_REGEX,
    MANGA_VOLUME_FILE_NAME_REGEX
} from "#electron/utils/constants";
import { stat } from "fs/promises";

/**
 * Used to extract a number from a manga volume file name.
 * @param filename The name of the file.
 */
export function extractNumberFromFilename(filename: string): string | null {
    const match = filename.match(/\d+(\.\d+)?/);
    return match ? match[0] : null;
}

/**
 * Normalize a manga name by converting it to lowercase and removing all non-alphanumeric characters.
 * @param name The name of the manga.
 * @returns The normalized manga name.
 * @example
 * ```typescript
 * normalizeMangaName("One Piece - Vol. 1"); // returns "onepiecevol1"
 * normalizeMangaName("Naruto!"); // returns "naruto"
 * normalizeMangaName("Attack on Titan (Shingeki no Kyojin)"); // returns "attackontitanshingekinokyojin"
 * ```
 */
export function normalizeMangaName(name: string | undefined): string {
    return name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '') : '';
}

/**
 * Split a file path into its components. It will split the file path by either "/" or "\" depending on the platform.
 * @param filePath The file path to split.
 */
export function splitPath(filePath: string): string[] {
    return process.platform === "win32" ? filePath.split("\\") : filePath.split("/");
}

/**
 * Find the manga name from the file path. It will try to find the manga name from the file name first, if it doesn't find it, it will try to find it from the directory name. If it still doesn't find it, it will return an empty string.
 * @param filePath The file path to find the manga name from.
 * @return The manga name if found, otherwise an empty string.
 */
export function findMangaName(filePath: string): string {
    const parts = splitPath(filePath)
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

    const matchWithMangaName = fileName.match(
        MANGA_VOLUME_FILE_NAME_WITH_MANGA_NAME_REGEX,
    );
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

export async function exists(path: string): Promise<boolean> {
    try {
        await stat(path);
        return true;
    } catch {
        return false;
    }
}