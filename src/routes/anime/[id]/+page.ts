import { jikanAnimeById } from '$lib/apiHandlers/jikan';
import type { PageLoad } from './$types';

export const load = (async ({ data }) => {
	if (data.anime.malId) {
		const malData = await jikanAnimeById(data.anime.malId);

		console.log(malData);

		return { ...data, malData };
	}
}) satisfies PageLoad;
