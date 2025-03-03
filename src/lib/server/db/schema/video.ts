import { episode } from './index';
import { id, uuid } from './utils';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

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
