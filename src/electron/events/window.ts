import App from "~/electron/structures/app";

/**
 * Sent from the frontend whenever the user wants to minimize the window
 */
export function onMinimize(this: App) {
    this.window?.minimize(); // Minimize the main window
}

/**
 * Sent from the frontend whenever the user wants to maximize the window
 */
export function onMaximize(this: App) {
    if (this.window?.isMaximized()) {
        // If the window is maximized, restore it and send an event so the frontend can update the button
        this.window?.unmaximize();
        this.window?.webContents.send("restored-window");
    } else {
        // If the window is not maximized, maximize it and send an event so the frontend can update the button
        this.window?.maximize();
        this.window?.webContents.send("maximized-window");
    }
}

/**
 * Sent from the frontend whenever the user wants to close the window
 */
export function onClose(this: App) {
    this.window?.close(); // Close the main window
}