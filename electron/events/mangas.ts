import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { IpcMainInvokeEvent } from "electron";
import { extractNumberFromFilename } from "#electron/utils/functions";

export async function getMangaData(event: IpcMainInvokeEvent, manga: string): Promise<MangaDataIPCAnswer> {
    const files = await readdir(path.join(__dirname, "..", "app", 'public', manga)).catch(() => []);
    const coverImage = files.find(file => file.endsWith('.jpg') || file.endsWith('.png')) || '';
    const coverImagePath = `/${manga}/${coverImage}`;
    const data = await readFile(path.join(__dirname, "..", "app", 'public', manga, 'data.json'), 'utf-8').catch(() => '{}');
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

/**
 * Get the recent lectures
 */
export async function getRecentMangas(): Promise<MangaData[]> {
    // for now return sample data
    const data: MangaData[] = [];
    for (let i = 0; i < 10; i++) {
        data.push({
            "name": "Tsugumomo",
            "description": "Kazuya Kagami, an ordinary boy, finds his life turned upside down when his late mother's obi transforms into a girl wearing a kimono named Kiriha. She happens to be a Tsukumogami called a \"tsugumomo,\" objects that have gained a soul through long years of harmony with their owners. Kazuya has no recollection of meeting Kiriha when she exclaims \"Long time no see\" to him. He nearly loses his life from an attacking \"amasogi\" that are premature spirits born only to fulfill impure wishes of certain people, and Kiriha defends him. With Kiriha's arrival, Kazuya enters a reality with gods and other Tsukumogami and slowly discovers his dark past.",
            "author": "Hamada Yoshikazu",
            "genres": [
                "Action",
                "Comedy",
                "Romance"
            ],
            "cover": "/tsugumomo/cover.jpg",
            "volumes": []
        });
    }

    return data;
}