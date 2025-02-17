import { Client, cacheExchange, fetchExchange } from 'urql';
import { graphql } from 'gql.tada';

const aniList = new Client({
	url: 'https://graphql.anilist.co',
	exchanges: [cacheExchange, fetchExchange]
});

const SearchAnimeByTitle = graphql(`
	query SearchAnimeByTitle($title: String) {
		Page {
			media(type: ANIME, search: $title) {
				title {
					romaji
				}
				idMal
			}
		}
	}
`);

const AnimeCoverById = graphql(`
	query AnimeById($idMal: Int) {
		Media(type: ANIME, idMal: $idMal) {
			coverImage {
				extraLarge
			}
		}
	}
`);

export const animeListByTitle = async (title: string) => {
	const { data, error } = await aniList.query(SearchAnimeByTitle, {
		title: title !== '' ? title : undefined
	});

	if (error) throw new Error(error.message);

	return data?.Page?.media ?? [];
};

export const animeCoverById = async (idMal: number) => {
	const { data, error } = await aniList.query(AnimeCoverById, {
		idMal
	});

	if (error) throw new Error(error.message);

	return data?.Media?.coverImage?.extraLarge;
};