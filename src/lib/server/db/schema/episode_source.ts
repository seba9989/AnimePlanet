import { download, episode, episodeSourceToGroup, group, video } from './';
import { id, uuid } from './utils';
import { relations } from 'drizzle-orm';
import { sqliteTable } from 'drizzle-orm/sqlite-core';

export const episodeSource = sqliteTable('episode_source', {
	id: uuid().primaryKey(),
	authorId: id()
		.notNull()
		.references(() => group.id),
	episodeId: id()
		.notNull()
		.references(() => episode.id)
});
export const episodeSourceRelations = relations(episodeSource, ({ one, many }) => ({
	author: one(group, { fields: [episodeSource.authorId], references: [group.id] }),
	episode: one(episode, { fields: [episodeSource.episodeId], references: [episode.id] }),
	groups: many(episodeSourceToGroup),
	videos: many(video),
	downloads: many(download)
}));

export type EpisodeSource = typeof episodeSource.$inferSelect;
export type CreateEpisodeSource = typeof episodeSource.$inferInsert;
