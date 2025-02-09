import { db } from '$lib/server/db';

import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

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

	if (!anime) return error(404, { message: 'Nie Znaleziono anime' });

	return { anime };
}) satisfies PageServerLoad;
