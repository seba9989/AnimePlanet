import MiniSearch from 'minisearch';
import type { Anime, TagsInAnime } from './server/db/schema';

interface AnimeWithTags extends Anime {
	tags: TagsInAnime[];
}

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
		const tags = anime.tags.map(({ tag }) => tag);
		animeSearch.add({ index, title: anime.title, tags });
	});
}

export function searchAnimeIndex(searchTitle: string | null, tags: string[] | string = []) {
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

	if (!results) return;

	return results.map(({ id }) => anime[id]);
}
