import { db } from '$lib/server/db';

import { error } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { textareaToStringArray } from '$lib/utils/form';
import { tagToAnime } from '$lib/server/db/schema';
import { tagToAnimeDbPrototype } from '$lib/utils/db';

export const load = (async (event) => {
	const animeId = event.params.id;

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
		const animeId = event.params.id;
		const tags = formData.getAll('tag') as string[];
		const embeds = textareaToStringArray(formData.get('embeds'));
		const downloads = textareaToStringArray(formData.get('downloads'));

		console.log(tags);
		console.log(tagToAnimeDbPrototype({ animeId, tags }));

		await db
			.insert(tagToAnime)
			.values(tagToAnimeDbPrototype({ animeId, tags }))
			.onConflictDoNothing();
	}
} satisfies Actions;
