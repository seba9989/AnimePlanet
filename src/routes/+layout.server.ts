import { db } from '$lib/server/db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const anime = await db.query.anime.findMany({
		with: {
			tags: true
		}
	});

	return { user: event.locals.user, anime };
};
