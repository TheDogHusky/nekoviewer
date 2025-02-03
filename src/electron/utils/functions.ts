/**
 * Used to extract a number from a manga volume file name.
 * @param filename The name of the file.
 */
export function extractNumberFromFilename(filename: string): string | null {
    const match = filename.match(/\d+(\.\d+)?/);
    return match ? match[0] : null;
}