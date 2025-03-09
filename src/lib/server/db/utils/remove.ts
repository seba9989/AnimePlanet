import { db } from '..';
import {
	anime,
	download,
	episode,
	tagToAnime,
	video,
	type Anime,
	type Episode,
	type TagToAnime,
	type Role,
	role
} from '../schema';
import { and, eq } from 'drizzle-orm';

type RemoveTagToAnime = TagToAnime;

export const removeTagToAnime = async ({ animeId, tag }: RemoveTagToAnime) => {
	await db.delete(tagToAnime).where(and(eq(tagToAnime.animeId, animeId), eq(tagToAnime.tag, tag)));
};

type RemoveLink = {
	type: 'video' | 'download';
	id: string;
};

export const removeLink = async ({ type, id }: RemoveLink) => {
	switch (type) {
		case 'video':
			await db.delete(video).where(eq(video.id, id));
			break;
		case 'download':
			await db.delete(download).where(eq(download.id, id));
			break;
	}
};

type RemoveEpisode = Pick<Episode, 'id'>;

export const removeEpisode = async ({ id }: RemoveEpisode) => {
	const episodeToRemove = await db.query.episode.findFirst({
		where: (episode, { eq }) => eq(episode.id, id),
		with: {
			downloads: true,
			videos: true
		}
	});

	episodeToRemove?.downloads.forEach(({ id }) => {
		removeLink({ type: 'download', id });
	});
	episodeToRemove?.videos.forEach(({ id }) => {
		removeLink({ type: 'video', id });
	});

	await db.delete(episode).where(eq(episode.id, id));
};

type RemoveAnime = Pick<Anime, 'id'>;
export const removeAnime = async ({ id }: RemoveAnime) => {
	const animeToRemove = await db.query.anime.findFirst({
		where: (anime, { eq }) => eq(anime.id, id),
		with: {
			episodes: true,
			tags: true
		}
	});

	animeToRemove?.episodes.forEach(({ id }) => {
		removeEpisode({ id });
	});

	animeToRemove?.tags.forEach(({ animeId, tag }) => {
		removeTagToAnime({ animeId, tag });
	});

	await db.delete(anime).where(eq(anime.id, id));
};

export const removeRole = async ({ name }: Role) => {
	await db.delete(role).where(eq(role.name, name));
};
