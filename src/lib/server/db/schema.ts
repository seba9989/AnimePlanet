import { sqliteTable, text, integer, primaryKey, unique } from 'drizzle-orm/sqlite-core';
import { init } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import type { Prettify } from '$lib/types/pretty';

const createId = init({
	length: 255
});

const id = (name?: string) => text(name);

const uuid = (name?: string) =>
	id(name)
		.$defaultFn(() => createId())
		.unique();

export const user = sqliteTable('user', {
	id: uuid().primaryKey(),
	age: integer({ mode: 'timestamp' }),
	email: text().unique().notNull(),
	login: text().unique().notNull(),
	passwordHash: text().notNull(),
	admin: integer({ mode: 'boolean' }).default(false)
});
export const userRelations = relations(user, ({ many }) => ({
	groups: many(userToGroup)
}));

export const session = sqliteTable('session', {
	id: uuid().primaryKey(),
	userId: id()
		.notNull()
		.references(() => user.id),
	expiresAt: integer({ mode: 'timestamp' }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

///////////
// Anime //
///////////
export const anime = sqliteTable('anime', {
	id: uuid().primaryKey(),
	title: text().unique().notNull(),
	releaseDate: integer({ mode: 'timestamp' }).notNull(),
	coverImageUrl: text().notNull(),
	nsfw: integer({ mode: 'boolean' }).default(false),
	malId: integer()
});
export const animeRelations = relations(anime, ({ many }) => ({
	episodes: many(episode),
	tags: many(tagToAnime)
}));

export type Anime = typeof anime.$inferSelect;
export type CreateAnime = typeof anime.$inferInsert;

/////////////
// Episode //
/////////////
export const episode = sqliteTable(
	'episode',
	{
		id: uuid().primaryKey(),
		animeId: id().notNull(),
		episodeNumber: integer().notNull(),
		title: text().notNull()
	},
	(t) => [unique().on(t.animeId, t.episodeNumber)]
);
export const episodeRelations = relations(episode, ({ one, many }) => ({
	anime: one(anime, { fields: [episode.animeId], references: [anime.id] }),
	videos: many(video),
	downloads: many(download)
}));

export type Episode = typeof episode.$inferSelect;
export type CreateEpisode = typeof episode.$inferInsert;

///////////
// Video //
///////////
export const video = sqliteTable('video', {
	id: uuid().primaryKey(),
	episodeId: id().notNull(),
	url: text().unique().notNull()
});
export const videoRelations = relations(video, ({ one }) => ({
	episode: one(episode, { fields: [video.episodeId], references: [episode.id] })
}));

export type Video = typeof video.$inferSelect;
export type CreateVideo = typeof video.$inferInsert;

//////////////
// Download //
//////////////
export const download = sqliteTable('download', {
	id: uuid().primaryKey(),
	episodeId: id().notNull(),
	url: text().unique().notNull()
});
export const downloadRelations = relations(download, ({ one }) => ({
	episode: one(episode, { fields: [download.episodeId], references: [episode.id] })
}));

export type Download = typeof download.$inferSelect;
export type CreateDownload = typeof download.$inferInsert;

/////////////////
// Link - Type //
/////////////////
export type Link = Prettify<Video & Download>;
export type CreateLink = Prettify<CreateVideo & CreateDownload>;

///////////
// Group //
///////////
export const group = sqliteTable('group', {
	id: uuid().primaryKey(),
	name: text().unique().notNull(),
	type: text({ enum: ['INTERNAL', 'VOICEOVER', 'SUBTITLES'] })
});
export const groupRelations = relations(group, ({ many }) => ({
	users: many(userToGroup)
}));

//////////
// Tags //
//////////
export const tag = sqliteTable('tag', {
	name: text().primaryKey()
});
export const tagRelations = relations(tag, ({ many }) => ({
	anime: many(tagToAnime)
}));

export type Tag = typeof tag.$inferSelect;
export type CreateTag = typeof tag.$inferInsert;

///////////////////
// User <=> Group //
///////////////////
export const userToGroup = sqliteTable(
	'user_to_group',
	{
		userId: id()
			.notNull()
			.references(() => user.id),
		groupId: id()
			.notNull()
			.references(() => group.id),
		role: text({ enum: ['user', 'mode', 'admin'] }).notNull()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.groupId] })
	})
);
export const userToGroupRelations = relations(userToGroup, ({ one }) => ({
	group: one(group, {
		fields: [userToGroup.groupId],
		references: [group.id]
	}),
	user: one(user, {
		fields: [userToGroup.userId],
		references: [user.id]
	})
}));

///////////////////
// Tag <=> Anime //
///////////////////
export const tagToAnime = sqliteTable(
	'tag_to_anime',
	{
		tag: text()
			.notNull()
			.references(() => tag.name),
		animeId: id()
			.notNull()
			.references(() => anime.id)
	},
	(t) => [primaryKey({ columns: [t.tag, t.animeId] })]
);
export const tagToAnimeRelations = relations(tagToAnime, ({ one }) => ({
	tag: one(tag, {
		fields: [tagToAnime.tag],
		references: [tag.name]
	}),
	anime: one(anime, {
		fields: [tagToAnime.animeId],
		references: [anime.id]
	})
}));

export type TagInAnime = typeof tagToAnime.$inferSelect;
export type CreateTagToAnime = typeof tagToAnime.$inferInsert;
