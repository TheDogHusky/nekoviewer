import App from "~/electron/structures/app";
import type { AppSettings } from "~/types/app";

/**
 * Gets the application version and platform
 * @returns The application version and platform
 */
export function startupInfos(this: App) {
    return {
        version: this.app.getVersion(),
        platform: process.platform
    }
}

/**
 * Update the settings from the frontend
 * @param fields The fields to update
 * @returns The result of the update (success or error)
 */
export async function updateSettings(this: App, fields: Partial<AppSettings>) {
    const err = await this.updateSettings(fields).catch(err => err);

    return {
        success: !err,
        error: err
    }
}