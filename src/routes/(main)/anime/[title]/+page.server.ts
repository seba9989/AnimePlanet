import { db } from '$lib/server/db';

import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const animeTitle = event.params.title;

	const anime = await db.query.anime.findFirst({
		where: (anime, { eq }) => eq(anime.title, animeTitle),
		with: {
			episodes: {
				orderBy: (episode, { asc }) => [asc(episode.episodeNumber)],
			},
			tags: true
		}
	});

	if (!anime) return error(404, { message: 'Nie Znaleziono anime' });

	return { anime };
}) satisfies PageServerLoad;
