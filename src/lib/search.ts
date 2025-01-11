import FlexSearch from 'flexsearch';
import type { Anime } from './server/db/schema';

let animeIndex: FlexSearch.Document<unknown>;
let anime: Anime[];

export function createAnimeIndex(data: Anime[]) {
	// create the posts index
	animeIndex = new FlexSearch.Document({
		tokenize: 'forward',
		document: {
			id: 'index',
			index: 'title',
			tag: 'tag'
		}
	});

	data.forEach((anime, i) => {
		animeIndex.add({ index: i, title: anime.title, tag: anime.nsfw ? 'nsfw' : false });
	});

	console.log(
		animeIndex.search('sdasdasdasd', {
			index: ['title'],
			tag: undefined,
			bool: 'and'
		})
	);

	anime = data;
}

export function searchAnimeIndex(searchTitle: string | undefined | null, tags?: string[] | null) {
	if (!searchTitle) return anime;
	if (!tags) tags = undefined;
	// escape special regex characters
	const match = searchTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	// return matching post indexes 💪
	const search = animeIndex.search(match, {
		index: ['title']
		// tag: tags,
		// bool: 'and'
	});
	if (search.length <= 0) return;

	const [{ result }] = search;

	// return { test: 'test' };
	return (
		result
			// filter the posts based on the matched index
			.map((index) => anime[index as number])
			// you can do whatever you want at this point 👌
			.map((anime) => {
				return anime;
			})
	);
}
