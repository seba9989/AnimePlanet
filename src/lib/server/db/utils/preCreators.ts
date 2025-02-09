import type { TEpisode, Genre } from '$lib/apiHandlers/jikan.d';
import type {
	CreateEpisode,
	CreateLink,
	CreateTag,
	CreateTagToAnime,
	Episode,
	Tag
} from '../schema';

export const tagDbPrototype = (tags: Genre[] | string[]): CreateTag[] => {
	return tags.map((tag) => {
		if (typeof tag == 'string') {
			return { name: tag };
		} else {
			return { name: tag.name };
		}
	});
};

export const tagToAnimeDbPrototype = (
	animeId: string,
	tags: Tag[] | Genre[] | string[]
): CreateTagToAnime[] => {
	return tags.map((tag) => {
		if (typeof tag == 'string') {
			return { animeId, tag };
		} else {
			return { animeId, tag: tag.name };
		}
	});
};

export const episodeDbPrototype = (animeId: string, episodesData: TEpisode[]): CreateEpisode[] => {
	return episodesData.map(({ mal_id: episodeNumber, title }) => {
		return { animeId, episodeNumber, title };
	});
};

export const linkDbPrototype = (episodeId: string, links: string[] = []): CreateLink[] => {
	return links.map((url) => {
		return { episodeId, url };
	});
};

export const linkDbPrototypeByTextarea = (episodes: Episode[], links: string[]): CreateLink[] => {
	return episodes.map(({ id, episodeNumber }) => {
		console.log(episodeNumber - 1);

		console.log(links[episodeNumber - 1]);

		return { episodeId: id, url: links[episodeNumber - 1] };
	});
};
