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