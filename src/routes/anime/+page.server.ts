import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const tags = await db.query.tag.findMany();
	return { tags };
}) satisfies PageServerLoad;
