/**
 * Represents the settings for the application.
 */
export interface AppSettings {
    /**
     * Miscellaneous settings
     */
    miscellaneous: MiscellaneousSettings;
    /**
     * Library settings
     */
    library: LibrarySettings;
    /**
     * Accessibility settings
     */
    accessibility: AccessibilitySettings;
    /**
     * General settings
     */
    general: GeneralSettings;
    /**
     * Appearance settings
     */
    appearance: AppearanceSettings;
}

/**
 * Represents miscellaneous settings.
 */
export interface MiscellaneousSettings {}

/**
 * Represents library settings.
 */
export interface LibrarySettings {
    /**
     * The mode in which the library is displayed.
     * Can be "grid" or "list".
     * Default is "list".
     * @default "list"
     */
    viewMode: "grid" | "list" | string;
    /**
     * The size of the cover images in the library.
     * Can be "sm", "md", "lg" or a custom size string.
     * Default is "md".
     * @default "md"
     */
    coverSize: "sm" | "md" | "lg" | string;
}

/**
 * Represents accessibility settings.
 */
export interface AccessibilitySettings {
    /**
     * In percentages.
     * Scale Factor will change the body font size, and all elements based on REMs and EMs will should be changed.
     * Basically an interface scale factor.
     * Default is 100% (1).
     * @default 1
     */
    scaleFactor: number;
    /**
     * Whether to reduce animations for accessibility purposes.
     * Default is false.
     * @default false
     */
    reduceAnimations: boolean;
    /**
     * Whether to enable smooth scrolling.
     * Default is true.
     * @default true
     */
    smoothScrolling: boolean;
}

/**
 * Represents general settings.
 */
export interface GeneralSettings {
    /**
     * Whether to enable notifications.
     * Notifications can be used for various purposes, such as notifying the user when their manga finished importing.
     * Default is true.
     * @default true
     */
    notifications: boolean;
}

/**
 * Represents appearance settings.
 */

export interface AppearanceSettings {}