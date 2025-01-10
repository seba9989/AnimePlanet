import type { CreateEpisode } from '$lib/server/db/schema';
import type { EpisodeData } from './jikanAnime';

export const episodeDbPrototype = (
	animeId: string,
	episodesData: EpisodeData[]
): CreateEpisode[] => {
	const episodes: CreateEpisode[] = [];

	for (const episodeData of episodesData) {
		episodes.push({ animeId, episodeNumber: episodeData.mal_id, title: episodeData.title });
	}

	return episodes;
};
