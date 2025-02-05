import { db } from '$lib/server/db';
import {
	createAnimeByMalId,
	createLinksToEpisode,
	updateEpisodesList
} from '$lib/server/db/utils/creators';
import { validForm } from '$lib/server/utils/formValidator';

import { error } from '@sveltejs/kit';
import vine from '@vinejs/vine';

import type { PageServerLoad, Actions } from './$types';
export const load = (async () => {
	const anime = await db.query.anime.findMany({
		with: {
			episodes: {
				orderBy: (episode, { desc }) => [desc(episode.episodeNumber)]
			}
		}
	});
	return { anime };
}) satisfies PageServerLoad;

const addAnimeSchema = vine.object({ malId: vine.number() });

const updateEpisodesListSchema = vine.object({
	malId: vine.number(),
	animeId: vine.string()
});

const addLinkToEpisodeSchema = vine.object({
	episodeId: vine.string(),
	videoUrl: vine.string().optional(),
	downloadUrl: vine.string().optional()
});

export const actions = {
	addAnime: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = await validForm(formData, addAnimeSchema);

		if (errors) return error(400, { message: errors.join('. ') + '.' });

		await createAnimeByMalId(data);

		return;
	},
	updateEpisodesList: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = await validForm(formData, updateEpisodesListSchema);

		if (errors) return error(400, { message: errors.join('. ') + '.' });

		await updateEpisodesList(data);

		return;
	},
	addLinkToEpisode: async (event) => {
		const formData = await event.request.formData();

		const { data, errors } = await validForm(formData, addLinkToEpisodeSchema);

		if (errors) return error(400, { message: errors.join('. ') + '.' });

		console.log(data);

		await createLinksToEpisode(data);
	}
} satisfies Actions;
