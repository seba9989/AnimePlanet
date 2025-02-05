import type { TAnime, TEpisode } from './jikan.d';

export const jikanAnimeById = async (id: number): Promise<TAnime> => {
	const resp = await (await fetch(`https://api.jikan.moe/v4/anime/${id}`)).json();

	return resp.data;
};

export const jikanAnimeByTitle = async (title: string): Promise<TAnime[]> => {
	const resp = await (await fetch(`https://api.jikan.moe/v4/anime?q=${title}`)).json();

	return resp.data;
};

export const jikanEpisodes = async (mal_animeId: number): Promise<TEpisode[]> => {
	const resp = await (await fetch(`https://api.jikan.moe/v4/anime/${mal_animeId}/episodes`)).json();

	return resp.data;
};
