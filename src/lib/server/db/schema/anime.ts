import { episode, tagToAnime } from './index';
import { uuid } from './utils';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const anime = sqliteTable('anime', {
	id: uuid().primaryKey(),
	title: text().unique().notNull(),
	releaseDate: integer({ mode: 'timestamp' }).notNull(),
	coverImageUrl: text().notNull(),
	nsfw: integer({ mode: 'boolean' }).default(false),
	malId: integer()
});
export const animeRelations = relations(anime, ({ many }) => ({
	episodes: many(episode),
	tags: many(tagToAnime)
}));

export type Anime = typeof anime.$inferSelect;
export type CreateAnime = typeof anime.$inferInsert;
