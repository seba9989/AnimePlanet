import { createAnimeIndex } from '$lib/search';
import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const anime = await db.query.anime.findMany();
	createAnimeIndex(anime);

	return {  };
}) satisfies PageServerLoad;
