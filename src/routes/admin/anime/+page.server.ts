import { db } from '$lib/server/db';
import { createAnimeByMalId, importedAnimeJson, removeAnime } from '$lib/server/db/utils';
import { validForm } from '$lib/server/utils/formValidator';
import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import { type } from 'arktype';

export const load = (async () => {
	const anime = await db.query.anime.findMany({
		orderBy: (anime, { asc }) => [asc(anime.title)],
		with: {
			episodes: {
				orderBy: (episode, { desc }) => [desc(episode.episodeNumber)]
			}
		}
	});
	return { anime };
}) satisfies PageServerLoad;

const addAnimeType = type({
	malId: 'number'
});

const removeAnimeType = type({
	id: 'string'
});

const importAnime = type({
	animeJson: type('File')
});

export const actions = {
	addAnime: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, addAnimeType);

		if (errors) return error(400, errors);

		await createAnimeByMalId(data);

		return;
	},
	removeAnime: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, removeAnimeType);

		if (errors) return error(400, errors);

		await removeAnime(data);
	},
	importAnime: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, importAnime, { debug: true });

		if (errors) return error(400, errors);

		try {
			await importedAnimeJson(data);
		} catch (e) {
			return error(400, (e as Error).message);
		}
	}
} satisfies Actions;
