import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const groups = await db.query.group.findMany({
		with: {
			users: true
		}
	});

	return { groups };
}) satisfies PageServerLoad;
