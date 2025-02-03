import { startupInfos } from "~/electron/events/app";
import {
    getBookData,
    getRecentBooks
} from "~/electron/events/books";
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
    "books:getBookData": {
        func: getBookData,
        type: "handle"
    },
    "books:getRecentBooks": {
        func: getRecentBooks,
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