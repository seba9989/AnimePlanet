import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async (event) => {
	if (!event.locals.user?.admin)
		error(401, { message: '🔒 Ta strona jest tylko dla administracji. 🔒' });
	return { user: event.locals.user };
}) satisfies LayoutServerLoad;
