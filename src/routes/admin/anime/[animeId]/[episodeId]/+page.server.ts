import { db } from '$lib/server/db';
import { removeLink, updateEpisode } from '$lib/server/db/utils';
import { validForm } from '$lib/server/utils/formValidator';
import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { type } from 'arktype';

export const load = (async ({ params }) => {
	const animeData = await db.query.anime.findFirst({
		where: (anime, { eq }) => eq(anime.id, params.animeId),
		with: {
			episodes: {
				where: (episode, { eq }) => eq(episode.id, params.episodeId),
				with: {
					videos: true,
					downloads: true
				}
			},
			tags: true
		}
	});

	if (!animeData) return error(404, { message: 'Nie Znaleziono anime' });

	const {
		episodes: [episode],
		...anime
	} = animeData;

	return { anime, episode };
}) satisfies PageServerLoad;

const removeLinkType = type({
	id: 'string',
	type: type('string').pipe.try((s) => {
		const [...v] = s;
		v.pop();
		return v.join('');
	}, type('"video" | "download"'))
});

const updateEpisodeType = type({
	episodeNumber: 'number',
	title: 'string'
});

export const actions = {
	remove: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, removeLinkType);

		if (errors) return error(400, errors);

		console.log(data);

		await removeLink(data);
	},
	updateEpisode: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, updateEpisodeType);

		if (errors) return error(400, errors);

		console.log(data);

		await updateEpisode({ id: event.params.episodeId, ...data });
	}
} satisfies Actions;
