import type { AnimeData, EpisodeData } from './jikanAnime';

export const jikanAnime = async (title: string): Promise<AnimeData> =>
	(await (await fetch(`https://api.jikan.moe/v4/anime?q=${title}`)).json()).data[0];
export const jikanEpisodes = async (mal_animeId: number): Promise<EpisodeData[]> =>
	(await (await fetch(`https://api.jikan.moe/v4/anime/${mal_animeId}/episodes`)).json()).data;