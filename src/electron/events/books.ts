import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { IpcMainInvokeEvent } from "electron";
import { extractNumberFromFilename } from "~/electron/utils/functions";

export async function getBookData(event: IpcMainInvokeEvent, manga: string): Promise<MangaDataIPCAnswer> {
    const files = await readdir(path.join(__dirname, "..", "src", 'public', manga)).catch(() => []);
    const coverImage = files.find(file => file.endsWith('.jpg') || file.endsWith('.png')) || '';
    const coverImagePath = `/${manga}/${coverImage}`;
    const data = await readFile(path.join(__dirname, "..", "src", 'public', manga, 'data.json'), 'utf-8').catch(() => '{}');
    const volumes = files.filter((file: string) => file.endsWith('.pdf')).map((file: string) => {
        return extractNumberFromFilename(file) || 0;
    }).sort((a, b) => parseFloat(String(a)) - parseFloat(String(b)));

    return {
        files,
        coverImagePath,
        data: JSON.parse(data),
        volumes
    };
}