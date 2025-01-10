import {
	mysqlTable,
	text,
	int,
	primaryKey,
	timestamp,
	boolean,
	varchar,
	unique
} from 'drizzle-orm/mysql-core';
import { init } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

const createId = init({
	length: 255
});

const id = (name: string) => varchar(name, { length: 255 });

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
	passwordHash: text('password_hash').notNull(),
	admin: boolean('admin').default(false)
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
	releaseDate: timestamp('release_date'),
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
export const episode = mysqlTable(
	'episode',
	{
		id: uuid('id').primaryKey(),
		animeId: id('anime_id').notNull(),
		episodeNumber: int('episode_number').notNull(),
		title: text('title')
	},
	(t) => ({
		unq: unique().on(t.animeId, t.episodeNumber)
	})
);
export const episodeRelations = relations(episode, ({ one, many }) => ({
	anime: one(anime, { fields: [episode.animeId], references: [anime.id] }),
	videos: many(video),
	downloads: many(download)
}));

export type Episode = typeof episode.$inferSelect;
export type CreateEpisode = typeof episode.$inferInsert;

///////////
// Video //
///////////
export const video = mysqlTable('video', {
	id: uuid('id').primaryKey(),
	episodeId: id('episode_id').notNull(),
	url: uniqueText('url').notNull()
});
export const videoRelations = relations(video, ({ one }) => ({
	episode: one(episode, { fields: [video.episodeId], references: [episode.id] })
}));

export type Video = typeof video.$inferSelect;
export type CreateVideo = typeof video.$inferInsert;

//////////////
// Download //
//////////////
export const download = mysqlTable('download', {
	id: uuid('id').primaryKey(),
	episodeId: id('episode_id').notNull(),
	url: uniqueText('url').notNull()
});
export const downloadRelations = relations(download, ({ one }) => ({
	episode: one(episode, { fields: [download.episodeId], references: [episode.id] })
}));

export type Download = typeof download.$inferSelect;
export type CreateDownload = typeof download.$inferInsert;

///////////
// Group //
///////////
export const group = mysqlTable('group', {
	id: uuid('id').primaryKey(),
	name: uniqueText('name').notNull()
});
export const groupRelations = relations(group, ({ many }) => ({
	users: many(userToGroup)
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
