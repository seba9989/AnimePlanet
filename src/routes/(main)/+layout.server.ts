import { db } from '$lib/server/db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const now = new Date();
	const userBirthYear = event.locals.user?.age?.getFullYear();

	let isAdult = false;

	if (userBirthYear) {
		isAdult = now.getFullYear() - userBirthYear >= 18;
	}

	const anime = await db.query.anime.findMany({
		where: (anime, { eq }) => eq(anime.nsfw, isAdult),
		with: {
			tags: true
		},
		orderBy: (anime, { desc }) => [desc(anime.releaseDate)]
	});

	return { anime };
};
