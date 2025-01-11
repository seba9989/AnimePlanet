import { db } from '$lib/server/db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const anime = await db.query.anime.findMany();

	return { user: event.locals.user, anime };
};
