import { db } from '$lib/server/db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const anime = await db.query.anime.findMany({
		with: {
			tags: true
		},
		orderBy: (anime, { desc }) => [desc(anime.releaseDate)]
	});

	return { user: event.locals.user, anime };
};
