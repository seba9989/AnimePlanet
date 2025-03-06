import { db } from '$lib/server/db';
import {
	createEpisode,
	createEpisodeByMal,
	removeEpisode,
	updateAnimeById
} from '$lib/server/db/utils';
import { sendAnime, sendEpisode } from '$lib/server/discord';
import { validForm } from '$lib/server/utils/formValidator';
import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { type } from 'arktype';

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
	'embeds?': type(linkType, '[]'),
	'downloads?': type(linkType, '[]')
});

const removeEpisodeType = type({
	episodeId: 'string'
});

const createEpisodeType = type({
	episodeNumber: 'number',
	title: "string = ''"
});

const updateEpisodesListType = type({
	animeMalId: 'number'
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
			animeId,
			...data
		});
	},
	removeEpisode: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, removeEpisodeType);

		if (errors) return error(400, errors);

		await removeEpisode({ id: data.episodeId });
	},
	createEpisode: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, createEpisodeType);

		if (errors) return error(400, errors);

		await createEpisode({ animeId: event.params.animeId, ...data });
	},
	updateEpisodesList: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, updateEpisodesListType);

		if (errors) return error(400, errors);

		await createEpisodeByMal({ ...data, animeId: event.params.animeId });
	},
	exportToJson: async (event) => {
		const animeId = event.params.animeId;
		const exportedAnime = await db.query.anime.findFirst({
			where: (anime, { eq }) => eq(anime.id, animeId),
			with: {
				episodes: {
					with: {
						downloads: true,
						videos: true
					}
				},
				tags: true
			}
		});

		return { exportedAnime: { animePlanetVersion: '0.3.10', ...exportedAnime } };
	},
	// TODO: Automate sending notification
	sendEpisode: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, sendEpisodeType);

		if (errors) return error(400, errors);

		await sendEpisode(data.episodeId, event.url.origin);
	},
	sendAnime: async (event) => {
		await sendAnime(event.params.animeId, event.url.origin);
	}
} satisfies Actions;
