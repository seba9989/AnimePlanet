import { episodeSource } from './index';
import { id, uuid } from './utils';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const video = sqliteTable('video', {
	id: uuid().primaryKey(),
	episodeSourceId: id()
		.notNull()
		.references(() => episodeSource.id),
	url: text().unique().notNull()
});
export const videoRelations = relations(video, ({ one }) => ({
	episodeSource: one(episodeSource, {
		fields: [video.episodeSourceId],
		references: [episodeSource.id]
	})
}));

export type Video = typeof video.$inferSelect;
export type CreateVideo = typeof video.$inferInsert;
