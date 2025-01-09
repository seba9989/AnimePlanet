import {
	mysqlTable,
	text,
	int,
	primaryKey,
	timestamp,
	boolean,
	varchar
} from 'drizzle-orm/mysql-core';
import { init } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

const createId = init({
	length: 255
});

const id = (name: string) => varchar(name, { length: 255 }).unique();

const uuid = (name: string) =>
	id(name)
		.$defaultFn(() => createId())
		.unique();

const uniqueText = (name: string) => varchar(name, { length: 255 }).unique();

export const user = mysqlTable('user', {
	id: uuid('id').primaryKey(),
	age: int('age'),
	email: uniqueText('email').notNull(),
	login: uniqueText('login').notNull(),
	passwordHash: text('password_hash').notNull()
});
export const userRelations = relations(user, ({ many }) => ({
	groups: many(userToGroup)
}));

export const session = mysqlTable('session', {
	id: uuid('id').primaryKey(),
	userId: id('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at').notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

///////////
// Anime //
///////////
export const anime = mysqlTable('anime', {
	id: uuid('id').primaryKey(),
	title: uniqueText('title').notNull(),
	releaseDate: timestamp('release_date').notNull(),
	coverImageUrl: text('cover_image_url').notNull(),
	nsfw: boolean('nsfw').default(false)
});
export const animeRelations = relations(anime, ({ many }) => ({
	episodes: many(episode)
}));

export type Anime = typeof anime.$inferSelect;

/////////////
// Episode //
/////////////
export const episode = mysqlTable('episode', {
	id: uuid('id').primaryKey(),
	animeId: id('anime_id').notNull(),
	episodeNumber: int('episode_number').notNull(),
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
export const link = mysqlTable('link', {
	id: uuid('id').primaryKey(),
	episodeId: id('episode_id').notNull(),
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
export const group = mysqlTable('group', {
	id: uuid('id').primaryKey(),
	name: uniqueText('name').notNull()
});
export const groupRelations = relations(group, ({ many }) => ({
	users: many(user)
}));

////////////////
// User Group //
////////////////
export const userToGroup = mysqlTable(
	'user_to_group',
	{
		userId: id('user_id')
			.notNull()
			.references(() => user.id),
		groupId: id('group_id')
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
