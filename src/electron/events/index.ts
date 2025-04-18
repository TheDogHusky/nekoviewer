import {
    startupInfos,
    updateSettings
} from "~/electron/events/app";
import {
    getMangaData,
    getRecentMangas
} from "~/electron/events/mangas";
import {
    onMinimize,
    onMaximize,
    onClose
} from "~/electron/events/window";

const events = {
    "app:startupInfos": {
        func: startupInfos,
        type: "handle"
    },
    "app:updateSettings": {
        func: updateSettings,
        type: "on"
    },
    "mangas:getMangaData": {
        func: getMangaData,
        type: "handle"
    },
    "mangas:getRecentMangas": {
        func: getRecentMangas,
        type: "handle"
    },
    "window:minimize": {
        func: onMinimize,
        type: "on"
    },
    "window:maximize": {
        func: onMaximize,
        type: "on"
    },
    "window:close": {
        func: onClose,
        type: "on"
    }
};

export default events;