import { userToGroup } from './index';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const role = sqliteTable('role', {
	name: text().primaryKey()
});
export const roleRelations = relations(role, ({ many }) => ({
	anime: many(userToGroup)
}));

export type Role = typeof role.$inferSelect;
export type CreateRole = typeof role.$inferInsert;
