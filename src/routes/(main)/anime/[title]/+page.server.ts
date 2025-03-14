import { db } from '$lib/server/db';
import { decodeUrl } from '$lib/utils/urlReadable';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async (event) => {
	const animeTitle = decodeUrl(event.params.title);

	const anime = await db.query.anime.findFirst({
		where: (anime, { eq }) => eq(anime.title, animeTitle),
		with: {
			episodes: {
				orderBy: (episode, { asc }) => [asc(episode.episodeNumber)]
			},
			tags: true
		}
	});

	if (!anime) return error(404, { message: 'Nie Znaleziono anime' });

	return { anime };
}) satisfies PageServerLoad;
