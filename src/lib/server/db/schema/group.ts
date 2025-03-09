import { episodeSourceToGroup, userToGroup } from './index';
import { uuid } from './utils';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const group = sqliteTable('group', {
	id: uuid().primaryKey(),
	name: text().unique().notNull(),
	type: text({ enum: ['INTERNAL', 'VOICEOVER', 'SUBTITLES'] }).notNull()
});
export const groupRelations = relations(group, ({ many }) => ({
	users: many(userToGroup),
	episodeSource: many(episodeSourceToGroup)
}));

console.log(group.type.enumValues);

export type Group = typeof group.$inferSelect;
export type CreateGroup = typeof group.$inferInsert;
