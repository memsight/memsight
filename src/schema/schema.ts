import { sqliteTable, text, blob, integer, numeric, index } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const cfKv = sqliteTable("_cf_KV", {
    key: text("key").primaryKey().notNull(),
    value: blob("value"),
});

export const d1Migrations = sqliteTable("d1_migrations", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name"),
    appliedAt: numeric("applied_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const notes = sqliteTable("notes", {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    userId: integer("user_id").notNull(),
    uriHash: text("uri_hash").notNull(),
    url: text("url").notNull(),
    length: integer("length").notNull(),
    title: text("title").notNull(),
    siteName: text("site_name").notNull(),
    lang: text("lang").notNull(),
    dir: text("dir").notNull(),
    byline: text("byline").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    textContent: text("text_content").notNull(),
    markdown: text("markdown").notNull(),
    publishedAt: text("published_at").notNull(),
    description: text("description").notNull(),
    image: text("image").notNull(),
    opengraph: text("opengraph").notNull(),
    waitTimeout: integer("wait_timeout").notNull(),
    createdAt: integer("created_at").notNull(),
},
    (table) => {
        return {
            idxNotesUriHash: index("idx_notes_uri_hash").on(table.uriHash),
            idxNotesUserId: index("idx_notes_user_id").on(table.userId),
        }
    });

export const tokens = sqliteTable("tokens", {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    userId: integer("user_id").notNull(),
    name: text("name").notNull(),
    secret: text("secret").notNull(),
    createdAt: integer("created_at").notNull(),
},
    (table) => {
        return {
            idxTokensUserId: index("idx_tokens_user_id").on(table.userId),
        }
    });

export const whiteLists = sqliteTable("white_lists", {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    userId: integer("user_id").notNull(),
    userName: text("user_name").notNull(),
    userAvatar: text("user_avatar").notNull(),
    name: text("name").notNull(),
    banner: text("banner").notNull(),
    desc: text("desc").notNull(),
    content: text("content").notNull(),
    createdAt: integer("created_at").notNull(),
}, (table) => {
    return {
        userIdx: index("user_idx").on(table.userId),
    };
});