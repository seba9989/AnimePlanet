import { db } from '$lib/server/db';
import {
	createAnimeByMalId,
	createLinksToEpisode,
	updateEpisodesList
} from '$lib/server/db/utils/creators';
import { validForm } from '$lib/server/utils/formValidator';
import { type } from 'arktype';

import { error } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';
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

const updateEpisodesListType = type({
	malId: 'number',
	animeId: 'string'
});

const addLinkToEpisodeType = type({
	episodeId: 'string',
	'videoUrl?': 'string',
	'downloadUrl?': 'string'
});

export const actions = {
	addAnime: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, addAnimeType);

		if (errors) return error(400, errors);

		console.log(data);

		await createAnimeByMalId(data);

		return;
	},
	updateEpisodesList: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, updateEpisodesListType);

		if (errors) return error(400, errors);

		await updateEpisodesList(data);

		return;
	},
	addLinkToEpisode: async (event) => {
		const formData = await event.request.formData();

		const { data, errors } = validForm(formData, addLinkToEpisodeType);

		if (errors) return error(400, errors);

		await createLinksToEpisode(data);
	}
} satisfies Actions;
