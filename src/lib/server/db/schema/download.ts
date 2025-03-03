import { episode } from './index';
import { id, uuid } from './utils';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

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
