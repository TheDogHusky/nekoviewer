import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type {
    GeneralSettings,
    LibrarySettings,
    AccessibilitySettings,
    AppearanceSettings,
    MiscellaneousSettings
} from "#types/app";
import type { MangaVolume } from "#types/manga";
import { sql } from "drizzle-orm";

/**
 * Current timestamp in milliseconds.
 */
const timeNow = sql`(unixepoch() * 1000)`;

// fits types/manga.ts
/**
 * Table to store manga data.
 * This table contains information about mangas, including their name, description, author, cover image,
 * genres, volumes, and display name.
 */
export const mangasTable = sqliteTable("mangas", {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    author: text("author"),
    cover: text("cover"),
    genres: text("genres", { mode: "json" }).$type<string[]>(),
    volumes: text("volumes", { mode: "json" }).$type<MangaVolume[]>(),
    displayName: text("display_name").notNull(),
});

/**
 * Table to store app settings.
 */
export const settingsTable = sqliteTable('settings', {
    general: text('general', { mode: 'json' }).$type<GeneralSettings>(),
    library: text('library', { mode: 'json' }).$type<LibrarySettings>(),
    accessibility: text('accessibility', { mode: 'json' }).$type<AccessibilitySettings>(),
    appearance: text('appearance', { mode: 'json' }).$type<AppearanceSettings>(),
    miscellaneous: text('miscellaneous', { mode: 'json' }).$type<MiscellaneousSettings>()
});

/**
 * Table to store the recent lectures opened and read by the user.
 */
export const recentsTable = sqliteTable('recents', {
    id: integer('id').primaryKey(),
    mangaId: integer('manga_id').notNull(),
    volume: text('volume').notNull(),
    page: integer('page').notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
            .default(timeNow)
            .$onUpdate(() => new Date()),
    createdAt: integer('created_at', { mode: "timestamp_ms" }).notNull().default(timeNow),
});

/**
 * Table to store the collections created by the user.
 */
export const collectionsTable = sqliteTable('collections', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    color: text('color').notNull(),
});

/**
 * Table to store the mangas in a collection.
 * This table is used to link mangas to collections and store their order in the collection.
 */
export const mangaInCollectionTable = sqliteTable('manga_in_collection', {
    id: integer('id').primaryKey(),
    mangaId: integer('manga_id').notNull(),
    collectionId: integer('collection_id').notNull(),
    index: integer('index').notNull().default(0) // should default to the last index in the collection, the logic will be handled in the app
});