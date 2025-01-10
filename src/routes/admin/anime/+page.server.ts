import { db } from '$lib/server/db';
import { anime, download, episode, video } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { jikanAnime, jikanEpisodes } from '$lib/utils/jikan';
import { episodeDbPrototype } from '$lib/utils/db';
import { sql } from 'drizzle-orm';

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

export const actions = {
	addAnime: async (event) => {
		const formData = await event.request.formData();
		const title = formData.get('title');
		if (typeof title != 'string') return error(400);
		const animeData = await jikanAnime(title);

		const [{ id: animeId }] = await db
			.insert(anime)
			.values({
				title: animeData.title,
				coverImageUrl: animeData.images.webp.large_image_url
			})
			.$returningId();

		const episodesData = await jikanEpisodes(animeData.mal_id);

		await db.insert(episode).values(episodeDbPrototype(animeId, episodesData));
		return;
	},
	updateEpisodesList: async (event) => {
		const formData = await event.request.formData();
		const animeId = formData.get('animeId');
		const animeTitle = formData.get('animeTitle');

		if (typeof animeId != 'string') return error(400);
		if (typeof animeTitle != 'string') return error(400);

		const { mal_id } = await jikanAnime(animeTitle);

		const episodesData = await jikanEpisodes(mal_id);
		await db
			.insert(episode)
			.values([
				...episodeDbPrototype(animeId, episodesData),
				{ animeId, episodeNumber: 5000, title: 'Test' }
			])
			.onDuplicateKeyUpdate({ set: { id: sql`id` } });
		// await db.update(episode).set({})
		return;
	},
	addLinkToEpisode: async (event) => {
		const formData = await event.request.formData();
		const episodeId = formData.get('episodeId');
		const videoUrl = formData.get('videoUrl');
		const downloadUrl = formData.get('downloadUrl');

		if (typeof episodeId != 'string') return error(400);
		if (typeof videoUrl != 'string') return error(400);
		if (typeof downloadUrl != 'string') return error(400);

		await db
			.insert(video)
			.values({ episodeId, url: videoUrl })
			.onDuplicateKeyUpdate({ set: { id: sql`id` } });
		await db
			.insert(download)
			.values({ episodeId, url: downloadUrl })
			.onDuplicateKeyUpdate({ set: { id: sql`id` } });
	}
} satisfies Actions;
