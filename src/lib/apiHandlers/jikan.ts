import { animeCoverById, animeIsNSFW } from './aniList';
import type { TAnime, TEpisode } from './jikan.d';

export const jikanAnimeById = async (id: number): Promise<TAnime & { nsfw: boolean }> => {
	const { data }: { data: TAnime } = await (
		await fetch(`https://api.jikan.moe/v4/anime/${id}`)
	).json();

	const animeCover = await animeCoverById(id);
	const isNSFW = await animeIsNSFW(id);

	if (animeCover) data.images.webp.large_image_url = animeCover;

	return { ...data, nsfw: isNSFW };
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

	return data;
};
