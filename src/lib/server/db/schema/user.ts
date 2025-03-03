import { userToGroup } from './index';
import { uuid } from './utils';
import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: uuid().primaryKey(),
	age: integer({ mode: 'timestamp' }),
	email: text().unique().notNull(),
	login: text().unique().notNull(),
	passwordHash: text().notNull(),
	admin: integer({ mode: 'boolean' }).default(false)
});

export const userRelations = relations(user, ({ many }) => ({
	groups: many(userToGroup)
}));

export type User = typeof user.$inferSelect;
export type CreateUser = typeof user.$inferInsert;
