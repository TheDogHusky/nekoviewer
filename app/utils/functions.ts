/**
 * Cleans out the manga name for later use on routing and internal processing
 * @param name The name of the manga
 * @returns The cleaned name
 */
export function cleanMangaName(name: string): string {
    // Remove the file extension
    name = name.replace(/\.[^/.]+$/, "");
    // Remove the volume number
    name = name.replace(/(v|vol|volume|#)\s*\d+/i, "").trim();
    // Remove any extra spaces
    name = name.replace(/\s+/g, "_").trim();
    return name.toLowerCase();
}