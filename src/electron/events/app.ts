import App from "~/electron/structures/app";

export function startupInfos(this: App) {
    return {
        version: this.app.getVersion(),
        platform: process.platform
    }
}