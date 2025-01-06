import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

const uuid = (name: string) =>
	text(name)
		.$defaultFn(() => createId())
		.unique();

export const user = sqliteTable('user', {
	id: uuid('id').primaryKey(),
	age: integer('age'),
	email: text('email').notNull().unique(),
	login: text('login').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});
export const userRelations = relations(user, ({ many }) => ({
	groups: many(userToGroup)
}));

export const session = sqliteTable('session', {
	id: uuid('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

///////////
// Anime //
///////////
export const anime = sqliteTable('anime', {
	id: uuid('id').primaryKey(),
	title: text('title').notNull().unique(),
	releaseDate: integer('release_date', { mode: 'timestamp' }).notNull(),
	coverImageUrl: text('cover_image_url').notNull(),
	nsfw: integer('nsfw', { mode: 'boolean' }).default(false)
});
export const animeRelations = relations(anime, ({ many }) => ({
	episodes: many(episode)
}));

export type Anime = typeof anime.$inferSelect;

/////////////
// Episode //
/////////////
export const episode = sqliteTable('episode', {
	id: uuid('id').primaryKey(),
	animeId: text('anime_id').notNull(),
	episodeNumber: integer('episode_number').notNull(),
	title: text('title')
});
export const episodeRelations = relations(episode, ({ one, many }) => ({
	anime: one(anime, { fields: [episode.animeId], references: [anime.id] }),
	links: many(link)
}));

export type Episode = typeof episode.$inferSelect;

//////////
// Link //
//////////
export const link = sqliteTable('link', {
	id: uuid('id').primaryKey(),
	episodeId: text('episode_id').notNull(),
	type: text('type', { enum: ['video', 'download'] }).notNull(),
	url: text('url').notNull()
});
export const linkRelations = relations(link, ({ one }) => ({
	episode: one(episode, { fields: [link.episodeId], references: [episode.id] })
}));

export type Link = typeof link.$inferSelect;

///////////
// Group //
///////////
export const group = sqliteTable('group', {
	id: uuid('id').primaryKey(),
	name: text('name').notNull().unique()
});
export const groupRelations = relations(group, ({ many }) => ({
	users: many(user)
}));

////////////////
// User Group //
////////////////
export const userToGroup = sqliteTable(
	'user_to_group',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		groupId: text('group_id')
			.notNull()
			.references(() => group.id),
		role: text('role', { enum: ['user', 'mode', 'admin'] }).notNull()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.groupId] })
	})
);
export const userToGroupRelations = relations(userToGroup, ({ one }) => ({
	group: one(group, {
		fields: [userToGroup.groupId],
		references: [group.id]
	}),
	user: one(user, {
		fields: [userToGroup.userId],
		references: [user.id]
	})
}));
