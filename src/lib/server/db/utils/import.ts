import { db } from '..';
import {
	anime,
	download,
	episode,
	tag,
	tagToAnime,
	video,
	type Anime,
	type Download,
	type Episode,
	type Video
} from '../schema';
import { tagDbPrototype, tagToAnimeDbPrototype } from './preFormating';
import { error } from '@sveltejs/kit';
import { type } from 'arktype';

const linkType = type({
	id: 'string',
	episodeId: 'string',
	url: 'string.url'
});

const episodeType = type({
	id: 'string',
	animeId: 'string',
	episodeNumber: 'number',
	title: 'string',
	'downloads?': [linkType, '[]'],
	'videos?': [linkType, '[]']
});

const tagToAnimeType = type({
	tag: 'string',
	animeId: 'string'
});

const importAnimeJsonType = type({
	animePlanetVersion: 'string',
	id: 'string',
	title: 'string',
	releaseDate: 'string.date.parse',
	coverImageUrl: 'string.url',
	nsfw: 'boolean',
	malId: 'number',
	'episodes?': [episodeType, '[]'],
	'tags?': [tagToAnimeType, '[]']
});

type ImportedAnimeJson = {
	animeJson: File | typeof importAnimeJsonType.infer;
};

export const importedAnimeJson = async ({ animeJson }: ImportedAnimeJson) => {
	try {
		const _animeJson =
			animeJson instanceof File
				? importAnimeJsonType(await JSON.parse(await animeJson.text()))
				: importAnimeJsonType(animeJson);
		if (_animeJson instanceof type.errors) throw new Error(_animeJson.summary);
		animeJson = _animeJson;
	} catch {
		throw new Error('This file is not a json');
	}

	await db.transaction(async (tx) => {
		const animePrototype = {
			id: animeJson.id,
			title: animeJson.title,
			releaseDate: animeJson.releaseDate,
			coverImageUrl: animeJson.coverImageUrl,
			nsfw: animeJson.nsfw,
			malId: animeJson.malId
		} satisfies Anime;

		await tx.insert(anime).values(animePrototype).onConflictDoNothing();

		const tags = animeJson.tags?.map(({ tag }) => tag);

		if (tags) {
			const tagsPrototype = tagDbPrototype(tags);

			await tx.insert(tag).values(tagsPrototype).onConflictDoNothing();
			await tx
				.insert(tagToAnime)
				.values(tagToAnimeDbPrototype(animeJson.id, tagsPrototype))
				.onConflictDoNothing();
		}

		const episodes = animeJson.episodes?.map(
			({ animeId, episodeNumber, id, title }) =>
				({
					animeId,
					episodeNumber,
					id,
					title
				}) satisfies Episode
		);

		if (episodes) {
			await tx.insert(episode).values(episodes).onConflictDoNothing();
		}

		const downloads: Download[] = [];
		const videos: Video[] = [];
		animeJson.episodes?.forEach(({ downloads: _downloads, videos: _videos }) => {
			if (_downloads) downloads.push(..._downloads);
			if (_videos) downloads.push(..._videos);
		});

		if (downloads.length > 0) {
			await tx.insert(download).values(downloads).onConflictDoNothing();
		}
		if (videos.length > 0) {
			await tx.insert(video).values(videos).onConflictDoNothing();
		}
	});
};
