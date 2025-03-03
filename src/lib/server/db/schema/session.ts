import { user } from './index';
import { id, uuid } from './utils';
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const session = sqliteTable('session', {
	id: uuid().primaryKey(),
	userId: id()
		.notNull()
		.references(() => user.id),
	expiresAt: integer({ mode: 'timestamp' }).notNull()
});

export type Session = typeof session.$inferSelect;
export type CreateSession = typeof session.$inferInsert;
