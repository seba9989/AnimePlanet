import type { Anime, TagToAnime } from './server/db/schema';
import type { Prettify } from './types/pretty';
import MiniSearch from 'minisearch';

type AnimeWithTags = Prettify<
	Anime & {
		tags?: TagToAnime[];
	}
>;

let animeSearch: MiniSearch;
let anime: AnimeWithTags[];

export function createAnimeIndex(data: AnimeWithTags[]) {
	anime = data;

	animeSearch = new MiniSearch({
		idField: 'index',
		fields: ['title'],
		storeFields: ['title', 'tags']
	});

	data.forEach((anime, index) => {
		const tags = anime.tags?.map(({ tag }) => tag) ?? [];
		animeSearch.add({ index, title: anime.title, tags });
	});
}

export function searchAnimeIndex<T extends AnimeWithTags>(
	searchTitle: string | null,
	tags: string[] | string = []
): T[] {
	if (searchTitle == '') searchTitle = null;
	if (tags == '' || typeof tags == 'string') tags = [];
	const searchTags = new Set(tags);

	const results = animeSearch.search(searchTitle ?? MiniSearch.wildcard, {
		prefix: true,
		filter: (result) => {
			const animeTags = new Set(result.tags as string[]);

			return animeTags.isSupersetOf(searchTags);
		}
	});

	if (!results) return [];

	return results.map(({ id }) => anime[id]) as T[];
}
