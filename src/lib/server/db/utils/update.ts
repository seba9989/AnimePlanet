import { jikanEpisodes } from '$lib/apiHandlers/jikan';
import { db } from '..';
import {
	anime,
	download,
	episode,
	tagToAnime,
	userToGroup,
	video,
	type Anime,
	type CreateLink,
	type CreateUserToGroup,
	type Episode,
	type UserToGroup
} from '../schema';
import { episodeDbPrototype, tagToAnimeDbPrototype } from './preFormating';
import { and, eq, inArray } from 'drizzle-orm';

type UpdateAnimeById = {
	animeId: Anime['id'];
	title: string;
	tags: string[];
	embeds?: CreateLink[];
	downloads?: CreateLink[];
};

export const updateAnimeById = async ({
	animeId,
	title,
	tags,
	embeds,
	downloads
}: UpdateAnimeById) => {
	db.transaction(async (tx) => {
		await tx.update(anime).set({ title }).where(eq(anime.id, animeId));

		const oldTagsObj = await tx.query.tagToAnime.findMany({
			where: (tagToAnime, { eq }) => eq(tagToAnime.animeId, animeId)
		});

		const oldTags = new Set(oldTagsObj.map(({ tag }) => tag));
		const newTags = new Set(tags);

		const tagsToRemove = oldTags.difference(newTags);
		const tagsToAdd = newTags.difference(oldTags);

		await tx
			.delete(tagToAnime)
			.where(and(eq(tagToAnime.animeId, animeId), inArray(tagToAnime.tag, [...tagsToRemove])));

		const tagsPrototype = tagToAnimeDbPrototype(animeId, [...tagsToAdd]);
		if (tagsPrototype.length > 0) await tx.insert(tagToAnime).values(tagsPrototype);

		if (embeds) await tx.insert(video).values(embeds);
		if (downloads) await tx.insert(download).values(downloads);
	});
};

type UpdateEpisodesList = {
	malId: number;
	animeId: Anime['id'];
};

export const updateEpisodesList = async ({ malId, animeId }: UpdateEpisodesList) => {
	const episodesData = await jikanEpisodes(malId);
	const episodePrototype = episodeDbPrototype(animeId, episodesData);

	await db.insert(episode).values(episodePrototype).onConflictDoNothing();
};

type UpdateEpisode = Omit<Episode, 'animeId'>;

export const updateEpisode = async ({ id, title, episodeNumber }: UpdateEpisode) => {
	await db.update(episode).set({ title, episodeNumber }).where(eq(episode.id, id));
};

type UpdateUserToGroup = {
	userId: UserToGroup['userId'];
	groupId: UserToGroup['groupId'];
	roles: string[];
};
export const updateUserToGroup = async ({ groupId, userId, roles }: UpdateUserToGroup) => {
	const current = await db.query.userToGroup.findMany({
		where: (userToGroup, { eq }) =>
			and(eq(userToGroup.userId, userId), eq(userToGroup.groupId, groupId)),
		columns: {
			role: true
		}
	});

	const currentRoles = new Set<string>(current.map(({ role }) => role));
	const newRoles = new Set<string>(roles);

	const rolesToRemove = currentRoles.difference(newRoles);
	const rolesToAdd = newRoles.difference(currentRoles);

	await db.transaction(async (tx) => {
		await tx
			.delete(userToGroup)
			.where(
				and(
					eq(userToGroup.userId, userId),
					eq(userToGroup.groupId, groupId),
					inArray(userToGroup.role, [...rolesToRemove])
				)
			);

		const userToGroupPrototype = [...rolesToAdd].map(
			(v) => ({ groupId, userId, role: v }) satisfies CreateUserToGroup
		);

		if (userToGroupPrototype.length > 0)
			await tx.insert(userToGroup).values(userToGroupPrototype).onConflictDoNothing();
	});
};
