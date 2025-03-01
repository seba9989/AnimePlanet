import { anime, download, video } from './index';
import { id, uuid } from './utils';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

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
