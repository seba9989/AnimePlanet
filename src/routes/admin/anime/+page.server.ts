import { db } from '$lib/server/db';
import { createAnimeByMalId, removeAnime, updateEpisodesList } from '$lib/server/db/utils';
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

// const addAnimeSchema = vine.object({ malId: vine.number() });
const addAnimeType = type({
	malId: 'number'
});

const removeAnimeType = type({
	id: 'string'
});

const updateEpisodesListType = type({
	malId: 'number',
	animeId: 'string'
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
		const { data, errors } = validForm(formData, removeAnimeType, { debug: true });

		if (errors) return error(400, errors);

		await removeAnime(data);
	},
	updateEpisodesList: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, updateEpisodesListType);

		if (errors) return error(400, errors);

		await updateEpisodesList(data);

		return;
	}
} satisfies Actions;
