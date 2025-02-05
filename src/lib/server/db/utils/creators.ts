import { jikanAnimeById, jikanEpisodes } from '$lib/apiHandlers/jikan';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '..';
import {
	anime,
	anime as animeDB,
	download,
	episode,
	tag,
	tagToAnime,
	video,
	type CreateAnime,
	type CreateLink,
	type Link
} from '../schema';
import {
	episodeDbPrototype,
	linkDbPrototype,
	tagDbPrototype,
	tagToAnimeDbPrototype
} from './preCreators';

type CreateAnimeByMalId = { malId: number };

export const createAnimeByMalId = async ({ malId }: CreateAnimeByMalId) => {
	const animeData = await jikanAnimeById(malId);
	const episodesData = await jikanEpisodes(animeData.mal_id);

	db.transaction(async (db) => {
		const animePrototype: CreateAnime = {
			title: animeData.title,
			releaseDate: new Date(animeData.aired.from),
			coverImageUrl: animeData.images.webp.large_image_url,
			malId: animeData.mal_id
		};

		const [anime] = await db
			.insert(animeDB)
			.values(animePrototype)
			.onConflictDoUpdate({ target: animeDB.id, set: animePrototype })
			.returning();

		const tagsPrototype = tagDbPrototype(animeData.genres);
		await db.insert(tag).values(tagsPrototype).onConflictDoNothing();
		await db
			.insert(tagToAnime)
			.values(tagToAnimeDbPrototype(anime.id, tagsPrototype))
			.onConflictDoNothing();

		if (animeData.type == 'Movie') {
			await db
				.insert(episode)
				.values({
					animeId: anime.id,
					episodeNumber: 0,
					title: anime.title
				})
				.onConflictDoNothing();
		} else {
			const episodePrototype = episodeDbPrototype(anime.id, episodesData);
			if (episodePrototype.length > 0) {
				await db.insert(episode).values(episodePrototype).onConflictDoNothing();
			}
		}
	});
};

type UpdateAnimeById = {
	id: string;
	title: string;
	tags: string[];
	embeds?: CreateLink[];
	downloads?: CreateLink[];
};

export const updateAnimeById = async ({ id, title, tags, embeds, downloads }: UpdateAnimeById) => {
	await db.update(anime).set({ title }).where(eq(anime.id, id)).returning();
	const oldTagsObj = await db.query.tagToAnime.findMany({
		where: (tagToAnime, { eq }) => eq(tagToAnime.animeId, id)
	});

	const oldTags = new Set(oldTagsObj.map(({ tag }) => tag));
	const newTags = new Set(tags);

	const tagsToRemove = oldTags.difference(newTags);
	const tagsToAdd = newTags.difference(oldTags);

	await db
		.delete(tagToAnime)
		.where(and(eq(tagToAnime.animeId, id), inArray(tagToAnime.tag, [...tagsToRemove])));

	const tagsPrototype = tagToAnimeDbPrototype(id, [...tagsToAdd]);
	if (tagsPrototype.length > 0) await db.insert(tagToAnime).values(tagsPrototype);

	if (embeds) await db.insert(video).values(embeds);
	if (downloads) await db.insert(download).values(downloads);
};

type UpdateEpisodesList = {
	malId: number;
	animeId: string;
};

export const updateEpisodesList = async ({ malId, animeId }: UpdateEpisodesList) => {
	const episodesData = await jikanEpisodes(malId);
	const episodePrototype = episodeDbPrototype(animeId, episodesData);

	await db.insert(episode).values(episodePrototype).onConflictDoNothing();
};

type CreateLinksToEpisode = {
	downloadUrl?: string | string[];
	videoUrl?: string | string[];
	episodeId: string;
};
export const createLinksToEpisode = async ({
	downloadUrl,
	videoUrl,
	episodeId
}: CreateLinksToEpisode) => {
	downloadUrl = typeof downloadUrl == 'string' ? downloadUrl.split(/\s/gm) : downloadUrl;
	videoUrl = typeof videoUrl == 'string' ? videoUrl.split(/\s/gm) : videoUrl;

	const downloadPrototype = linkDbPrototype(episodeId, downloadUrl);
	const videoPrototype = linkDbPrototype(episodeId, videoUrl);

	if (downloadPrototype.length > 0)
		await db.insert(download).values(downloadPrototype).onConflictDoNothing();

	if (videoPrototype.length > 0)
		await db.insert(video).values(videoPrototype).onConflictDoNothing();
};

type RemoveLink = {
	type: 'video' | 'download';
	id: string;
};

export const removeLink = async ({ type, id }: RemoveLink) => {
	switch (type) {
		case 'video':
			await db.delete(video).where(eq(video.id, id));
			break;
		case 'download':
			await db.delete(download).where(eq(download.id, id));
			break;
	}
};
