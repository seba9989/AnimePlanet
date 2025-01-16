import type { CreateEpisode, CreateTag, CreateTagToAnime } from '$lib/server/db/schema';
import type { AnimeData, EpisodeData } from './jikanAnime';

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

export const tagDbPrototype = (animeData: AnimeData): CreateTag[] => {
	let tags: CreateTag[] = [];

	const { genres } = animeData;

	for (const { name } of genres) {
		tags = [{ name }, ...tags];
	}

	return tags;
};

export const tagToAnimeDbPrototype = (
	animeId: string,
	animeData: AnimeData
): CreateTagToAnime[] => {
	let tags: CreateTagToAnime[] = [];

	const { genres } = animeData;

	for (const { name } of genres) {
		tags = [{ animeId, tag: name }, ...tags];
	}

	return tags;
};
