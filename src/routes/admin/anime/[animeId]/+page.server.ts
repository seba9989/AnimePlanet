import { db } from '$lib/server/db';

import { error } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { send } from '$lib/server/discord';
import { validForm } from '$lib/server/utils/formValidator';
import vine from '@vinejs/vine';
import { removeLink, updateAnimeById } from '$lib/server/db/utils/creators';
import { jsonString } from '$lib/server/utils/customVien';

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

const linkSchema = vine
	.array(
		jsonString({
			episodeId: vine.string(),
			url: vine.string().url()
		})
	)
	.parse((value) => {
		if (vine.helpers.isArray(value)) return value;
		if (typeof value === 'string') return [value];
		return;
	})
	.optional();

const saveSchema = vine.object({
	title: vine.string().minLength(1),
	tags: vine.array(vine.string()),
	embeds: linkSchema,
	downloads: linkSchema
});

const removeLinkSchema = vine.object({
	id: vine.string()
});

export const actions = {
	save: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = await validForm(formData, saveSchema);

		const animeId = event.params.animeId;

		if (errors) return error(400, { message: errors.join('. ') + '.' });

		await updateAnimeById({ id: animeId, ...data });
	},
	removeVideo: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = await validForm(formData, removeLinkSchema);

		if (errors) return error(400, { message: errors.join('. ') + '.' });

		await removeLink({ type: 'video', ...data });
	},
	removeDownload: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = await validForm(formData, removeLinkSchema);

		if (errors) return error(400, { message: errors.join('. ') + '.' });

		await removeLink({ type: 'download', ...data });
	},
	// TODO: Automate sending notification
	sendEpisode: async (event) => {
		const formData = await event.request.formData();
		const episodeId = formData.get('episodeId') as string;
		send(episodeId, event.url.origin);
	}
} satisfies Actions;
