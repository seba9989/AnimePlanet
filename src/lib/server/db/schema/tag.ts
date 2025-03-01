import { tagToAnime } from './index';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tag = sqliteTable('tag', {
	name: text().primaryKey()
});
export const tagRelations = relations(tag, ({ many }) => ({
	anime: many(tagToAnime)
}));

export type Tag = typeof tag.$inferSelect;
export type CreateTag = typeof tag.$inferInsert;
