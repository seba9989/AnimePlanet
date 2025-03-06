import { anime, group, role, tag, user } from './index';
import { id } from './utils';
import { relations } from 'drizzle-orm';
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

////////////////////
// User <=> Group //
////////////////////
export const userToGroup = sqliteTable(
	'user_to_group',
	{
		userId: id()
			.notNull()
			.references(() => user.id),
		groupId: id()
			.notNull()
			.references(() => group.id),
		role: id()
			.notNull()
			.references(() => role.name)
	},
	(t) => [primaryKey({ columns: [t.userId, t.groupId] })]
);

export const userToGroupRelations = relations(userToGroup, ({ one }) => ({
	group: one(group, {
		fields: [userToGroup.groupId],
		references: [group.id]
	}),
	user: one(user, {
		fields: [userToGroup.userId],
		references: [user.id]
	}),
	role: one(role, {
		fields: [userToGroup.role],
		references: [role.name]
	})
}));
export type UserToGroup = typeof userToGroup.$inferSelect;
export type CreateUserToGroup = typeof userToGroup.$inferInsert;

///////////////////
// Tag <=> Anime //
///////////////////

export const tagToAnime = sqliteTable(
	'tag_to_anime',
	{
		tag: text()
			.notNull()
			.references(() => tag.name),
		animeId: id()
			.notNull()
			.references(() => anime.id)
	},
	(t) => [primaryKey({ columns: [t.tag, t.animeId] })]
);
export const tagToAnimeRelations = relations(tagToAnime, ({ one }) => ({
	tag: one(tag, {
		fields: [tagToAnime.tag],
		references: [tag.name]
	}),
	anime: one(anime, {
		fields: [tagToAnime.animeId],
		references: [anime.id]
	})
}));

export type TagToAnime = typeof tagToAnime.$inferSelect;
export type CreateTagToAnime = typeof tagToAnime.$inferInsert;
