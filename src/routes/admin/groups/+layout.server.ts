import { db } from '$lib/server/db';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	const roles = await db.query.role.findMany();
	const groupTypes = { INTERNAL: 'Wewnętrzna', VOICEOVER: 'Lektor', SUBTITLES: 'Napisy' };

	return { groupTypes, roles: roles.map(({ name }) => name) };
}) satisfies LayoutServerLoad;
