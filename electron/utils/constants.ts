export const DEFAULT_SETTINGS_VALUES = {
    general: {
        notifications: true
    },
    library: {
        viewMode: "list",
        coverSize: "md"
    },
    accessibility: {
        scaleFactor: 1,
        reduceAnimations: false,
        smoothScrolling: true
    },
    appearance: {},
    miscellaneous: {}
};

export const EXTENSIONS = ["cbz", "cbr", "pdf"];
export const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "bmp", "webp"];

export const MANGA_VOLUME_FILE_NAME_REGEX = /^Vol\.?\s*(\d+)\.(cbz|cbr|pdf)$/i;
export const MANGA_VOLUME_FILE_NAME_WITH_MANGA_NAME_REGEX = /^(.*?)\s*-\s*Vol\.?\s*(\d+)\.(cbz|cbr|pdf)$/i;
export const DIRECTORY_MANGA_NAME_REGEX = /^(.*?)\s*-\s*Vol\.?\s*(\d+)$/i;