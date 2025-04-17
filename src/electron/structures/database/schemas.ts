import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

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