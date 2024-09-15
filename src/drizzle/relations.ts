import { relations } from "drizzle-orm/relations";
import { genre, genresOnSongs, song, playlist, user } from "./schema";

export const genresOnSongsRelations = relations(genresOnSongs, ({one}) => ({
	genre: one(genre, {
		fields: [genresOnSongs.genreId],
		references: [genre.id]
	}),
	song: one(song, {
		fields: [genresOnSongs.songId],
		references: [song.id]
	}),
}));

export const genreRelations = relations(genre, ({many}) => ({
	genresOnSongs: many(genresOnSongs),
}));

export const songRelations = relations(song, ({many}) => ({
	genresOnSongs: many(genresOnSongs),
	playlists: many(playlist),
}));

export const playlistRelations = relations(playlist, ({one}) => ({
	song: one(song, {
		fields: [playlist.songId],
		references: [song.id]
	}),
	user: one(user, {
		fields: [playlist.userId],
		references: [user.uid]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	playlists: many(playlist),
}));