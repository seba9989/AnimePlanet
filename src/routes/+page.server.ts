import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const anime = await db.query.anime.findMany();
	return { anime };
}) satisfies PageServerLoad;
