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
	const data: TEpisode[] = [];
	let page: number = 1;

	while (true) {
		const resp = await (
			await fetch(`https://api.jikan.moe/v4/anime/${mal_animeId}/episodes?page=${page}`)
		).json();

		data.push(...resp.data);

		if (!resp.pagination.has_next_page) {
			break;
		} else {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			page++;
		}
	}

	console.log(data);

	return data;
};
