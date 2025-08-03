import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type {
    GeneralSettings,
    LibrarySettings,
    AccessibilitySettings,
    AppearanceSettings,
    MiscellaneousSettings
} from "../../utils/types";

// fits types/manga.d.ts
export const mangasTable = sqliteTable("mangas", {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    author: text("author").notNull(),
    cover: text("cover").notNull(),
    genres: text("genres", { mode: "json" }).$type<string[]>(),
    volumes: text("volumes", { mode: "json" }).$type<MangaVolume[]>(),
});

/**
 * Table to store app settings
 */
export const settingsTable = sqliteTable('settings', {
    general: text('general', { mode: 'json' }).$type<GeneralSettings>(),
    library: text('library', { mode: 'json' }).$type<LibrarySettings>(),
    accessibility: text('accessibility', { mode: 'json' }).$type<AccessibilitySettings>(),
    appearance: text('appearance', { mode: 'json' }).$type<AppearanceSettings>(),
    miscellaneous: text('miscellaneous', { mode: 'json' }).$type<MiscellaneousSettings>()
});