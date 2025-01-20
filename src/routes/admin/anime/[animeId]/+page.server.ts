import { db } from '$lib/server/db';

import { error } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { textareaToStringArray } from '$lib/utils/form';
import { tagToAnime, video } from '$lib/server/db/schema';
import { tagToAnimeDbPrototype } from '$lib/utils/db';
import { eq } from 'drizzle-orm';
import { send } from '$lib/server/discord';

export const load = (async (event) => {
	const animeId = event.params.animeId;

	const anime = await db.query.anime.findFirst({
		where: (anime, { eq }) => eq(anime.id, animeId),
		with: {
			episodes: {
				orderBy: (episode, { asc }) => [asc(episode.episodeNumber)],
				with: {
					videos: true,
					downloads: true
				}
			},
			tags: true
		}
	});
	const tags = await db.query.tag.findMany();

	if (!anime) return error(404, { message: 'Nie Znaleziono anime' });

	return { anime, tags };
}) satisfies PageServerLoad;

export const actions = {
	save: async (event) => {
		const formData = await event.request.formData();
		const animeId = event.params.animeId;
		const tags = formData.getAll('tag') as string[];

		const embeds = textareaToStringArray(formData.get('embeds'));
		const downloads = textareaToStringArray(formData.get('downloads'));

		console.log(embeds);
		console.log(downloads);

		console.log(tags);

		await db
			.insert(tagToAnime)
			.values(tagToAnimeDbPrototype({ animeId, tags }))
			.onConflictDoNothing();
	},
	removeLink: async (event) => {
		const formData = await event.request.formData();
		const videoId = formData.get('videoId') as string;

		console.log(videoId);

		await db.delete(video).where(eq(video.id, videoId));
	},
	sendEpisode: async (event) => {
		const formData = await event.request.formData();
		const episodeId = formData.get('episodeId') as string;
		send(episodeId, event.url.origin);
	}
} satisfies Actions;
