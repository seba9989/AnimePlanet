import { createEpisode, removeEpisode, updateAnimeById } from '$lib/server/db/utils/creators';
import { send } from '$lib/server/discord';
import { validForm } from '$lib/server/utils/formValidator';

import { error } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { type } from 'arktype';
import { db } from '$lib/server/db';

export const load = (async (event) => {
	const animeId = event.params.animeId;

	const anime = await db.query.anime.findFirst({
		where: (anime, { eq }) => eq(anime.id, animeId),
		with: {
			episodes: {
				orderBy: (episode, { asc }) => [asc(episode.episodeNumber)]
			},
			tags: true
		}
	});
	const tags = await db.query.tag.findMany();

	if (!anime) return error(404, { message: 'Nie Znaleziono anime' });

	return { anime, tags };
}) satisfies PageServerLoad;

const linkType = type({
	episodeId: 'string',
	url: 'string.url'
});

const saveType = type({
	title: 'string',
	tags: 'string[]',
	embeds: type(linkType, '[]').or('undefined'),
	downloads: type(linkType, '[]').or('undefined')
});

const removeEpisodeType = type({
	id: 'string'
});

const createEpisodeType = type({
	episodeNumber: 'number',
	title: 'string'
});

const sendEpisodeType = type({
	episodeId: 'string'
});

export const actions = {
	save: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, saveType);

		const animeId = event.params.animeId;

		if (errors) return error(400, errors);

		await updateAnimeById({
			id: animeId,
			...data
		});
	},
	removeEpisode: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, removeEpisodeType);

		if (errors) return error(400, errors);

		await removeEpisode(data);
	},
	createEpisode: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, createEpisodeType);

		if (errors) return error(400, errors);

		await createEpisode({ animeId: event.params.animeId, ...data });
	},
	// TODO: Automate sending notification
	sendEpisode: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, sendEpisodeType);

		if (errors) return error(400, errors);

		await send(data.episodeId, event.url.origin);
	}
} satisfies Actions;
