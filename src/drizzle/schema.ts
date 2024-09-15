import {
  pgTable,
  varchar,
  timestamp,
  text,
  integer,
  serial,
  uniqueIndex,
  bigint,
  foreignKey,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const prismaMigrations = pgTable("_prisma_migrations", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  checksum: varchar("checksum", { length: 64 }).notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true, mode: "string" }),
  migrationName: varchar("migration_name", { length: 255 }).notNull(),
  logs: text("logs"),
  rolledBackAt: timestamp("rolled_back_at", {
    withTimezone: true,
    mode: "string",
  }),
  startedAt: timestamp("started_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const genre = pgTable("genre", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
});

export const song = pgTable("song", {
  id: serial("id").primaryKey().notNull(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  lang: text("lang").notNull(),
});

export const user = pgTable(
  "user",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    uid: bigint("uid", { mode: "number" }).primaryKey().notNull(),
    name: text("name").notNull(),
    nickname: text("nickname").notNull(),
    avatar: text("avatar").notNull(),
  },
  (table) => {
    return {
      nicknameKey: uniqueIndex("user_nickname_key").using(
        "btree",
        table.nickname.asc().nullsLast()
      ),
    };
  }
);

export const genresOnSongs = pgTable(
  "genres_on_songs",
  {
    genreId: integer("genre_id").notNull(),
    songId: integer("song_id").notNull(),
  },
  (table) => {
    return {
      genresOnSongsGenreIdFkey: foreignKey({
        columns: [table.genreId],
        foreignColumns: [genre.id],
        name: "genres_on_songs_genre_id_fkey",
      })
        .onUpdate("cascade")
        .onDelete("restrict"),
      genresOnSongsSongIdFkey: foreignKey({
        columns: [table.songId],
        foreignColumns: [song.id],
        name: "genres_on_songs_song_id_fkey",
      })
        .onUpdate("cascade")
        .onDelete("restrict"),
      genresOnSongsPkey: primaryKey({
        columns: [table.genreId, table.songId],
        name: "genres_on_songs_pkey",
      }),
    };
  }
);

export const playlist = pgTable(
  "playlist",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
    songId: integer("song_id").notNull(),
    tags: text("tags").array(),
  },
  (table) => {
    return {
      playlistSongIdFkey: foreignKey({
        columns: [table.songId],
        foreignColumns: [song.id],
        name: "playlist_song_id_fkey",
      })
        .onUpdate("cascade")
        .onDelete("restrict"),
      playlistUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [user.uid],
        name: "playlist_user_id_fkey",
      })
        .onUpdate("cascade")
        .onDelete("restrict"),
      playlistPkey: primaryKey({
        columns: [table.userId, table.songId],
        name: "playlist_pkey",
      }),
    };
  }
);
