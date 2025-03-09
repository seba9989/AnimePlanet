import { download, episode, episodeSourceToGroup, video } from './';
import { id, uuid } from './utils';
import { relations } from 'drizzle-orm';
import { sqliteTable } from 'drizzle-orm/sqlite-core';

export const episodeSource = sqliteTable('episode_source', {
	id: uuid().primaryKey(),
	episodeId: id().notNull()
});
export const episodeSourceRelations = relations(episodeSource, ({ one, many }) => ({
	episode: one(episode, { fields: [episodeSource.episodeId], references: [episode.id] }),
	groups: many(episodeSourceToGroup),
	videos: many(video),
	downloads: many(download)
}));

export type EpisodeSource = typeof episodeSource.$inferSelect;
export type CreateEpisodeSource = typeof episodeSource.$inferInsert;
