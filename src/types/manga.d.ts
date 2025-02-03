/**
 * The data structure for the book
 */
interface MangaData {
    /**
     * Manga name
     */
    name: string;
    /**
     * Manga description (synopsis)
     */
    description: string;
    /**
     * Manga author
     */
    author: string;
    /**
     * The genres of the book
     */
    genres: string[];
    /**
     * The cover image path for the book
     */
    cover: string;
    /**
     * The volumes of the book
     * Could be either some data retrieved by the electron backend (saved on the database) so it's an array of MangaVolume
     * or just an array of strings with the volume names (retrieved by scanning for files)
     */
    volumes: MangaVolume[] | string[];
}

/**
 * The data structure for a book volume
 */
interface MangaVolume {
    /**
     * The volume name
     */
    name: string;
    /**
     * The number of pages in the volume
     */
    pages: number;
    /**
     * The volume number
     */
    number: number;
}

interface MangaDataIPCAnswer {
    files: string[];
    coverImagePath: string;
    data: MangaData;
    volumes: (string | 0)[];
}