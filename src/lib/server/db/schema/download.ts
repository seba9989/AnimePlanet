import { episodeSource } from './index';
import { id, uuid } from './utils';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const download = sqliteTable('download', {
	id: uuid().primaryKey(),
	episodeSourceId: id().notNull(),
	url: text().unique().notNull()
});
export const downloadRelations = relations(download, ({ one }) => ({
	episodeSource: one(episodeSource, {
		fields: [download.episodeSourceId],
		references: [episodeSource.id]
	})
}));

export type Download = typeof download.$inferSelect;
export type CreateDownload = typeof download.$inferInsert;
