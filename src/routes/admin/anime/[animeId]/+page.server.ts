import { db } from '$lib/server/db';
import { removeLink, updateAnimeById } from '$lib/server/db/utils/creators';
import { send } from '$lib/server/discord';
import { validForm } from '$lib/server/utils/formValidator';

import { error } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { type } from 'arktype';

export const load = (async (event) => {
	const animeId = event.params.animeId;

	const anime = await db.query.anime.findFirst({
		where: (anime, { eq }) => eq(anime.id, animeId),
		with: {
			episodes: {
				orderBy: (episode, { asc }) => [asc(episode.episodeNumber)],
				with: {
					videos: true,
					downloads: true
				}
			},
			tags: true
		}
	});
	const tags = await db.query.tag.findMany();

	if (!anime) return error(404, { message: 'Nie Znaleziono anime' });

	return { anime, tags };
}) satisfies PageServerLoad;

const linkType = type('string.json.parse').to({
	episodeId: 'string',
	url: 'string.url'
});

const saveType = type({
	title: 'string',
	tags: 'string[]',
	embeds: type(linkType, '[]').or('undefined'),
	downloads: type(linkType, '[]').or('undefined')
});

const removeLinkType = type({
	id: 'string'
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
	removeVideo: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, removeLinkType);

		if (errors) return error(400, errors);

		await removeLink({ type: 'video', ...data });
	},
	removeDownload: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, removeLinkType);

		if (errors) return error(400, errors);

		await removeLink({ type: 'download', ...data });
	},
	// TODO: Automate sending notification
	sendEpisode: async (event) => {
		const formData = await event.request.formData();
		const episodeId = formData.get('episodeId') as string;
		send(episodeId, event.url.origin);
	}
} satisfies Actions;
