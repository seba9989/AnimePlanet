import { env } from '$env/dynamic/private';
import { db } from '../db';
import {
	Client,
	EmbedBuilder,
	Events,
	GatewayIntentBits,
	NewsChannel,
	TextChannel
} from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

if (!env.DC_BOT_TOKEN) throw new Error('DC_BOT_TOKEN is not set');
if (!env.DC_EPISODES_CHANNEL) throw new Error('DC_EPISODES_CHANNEL is not set');

export const sendEpisode = async (episodeId: string, originUrl: string) => {
	const episode = await db.query.episode.findFirst({
		where: (episode, { eq }) => eq(episode.id, episodeId),
		with: {
			anime: true
		}
	});

	if (!episode) return;

	// inside a command, event listener, etc.
	const episodeEmbed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle(`${episode.anime.title} ${episode.episodeNumber}`)
		.setURL(encodeURI(`${originUrl}/anime/${episode.anime.title}/${episode.episodeNumber}`))
		.setDescription(`Tytuł: ${episode.title}`)
		.setImage(episode.anime.coverImageUrl)
		.setTimestamp()
		.setFooter({ text: 'AnimePlanet', iconURL: `${originUrl}/favicon.png` });

	const episodesChannel = await client.channels.fetch(env.DC_EPISODES_CHANNEL);

	if (!(episodesChannel instanceof TextChannel) && !(episodesChannel instanceof NewsChannel))
		return;

	let content = '**Zapraszamy do oglądania!**';
	if (env.DC_ROLE_ID) content += ` <@&${env.DC_ROLE_ID}>`;

	await episodesChannel.send({
		embeds: [episodeEmbed],
		content
	});
};

export const sendAnime = async (animeId: string, originUrl: string) => {
	const anime = await db.query.anime.findFirst({
		where: (anime, { eq }) => eq(anime.id, animeId),
		with: {
			episodes: {
				columns: {
					episodeNumber: true
				},
				orderBy: (episodes, { asc }) => [asc(episodes.episodeNumber)]
			}
		}
	});

	if (!anime) return;

	const animeUrl = encodeURI(`${originUrl}/anime/${anime.title}`);

	// inside a command, event listener, etc.
	const animeEmbed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle(
			`${anime.title} ${anime.episodes.at(0)?.episodeNumber}-${anime.episodes.at(-1)?.episodeNumber}`
		)
		.setURL(animeUrl)
		.setDescription(
			anime.episodes
				.map(({ episodeNumber }) => `[Episode ${episodeNumber}](${animeUrl}/${episodeNumber})`)
				.join('\n')
		)
		.setImage(anime.coverImageUrl)
		.setTimestamp()
		.setFooter({ text: 'AnimePlanet', iconURL: `${originUrl}/favicon.png` });

	const episodesChannel = await client.channels.fetch(env.DC_EPISODES_CHANNEL);

	if (!(episodesChannel instanceof TextChannel) && !(episodesChannel instanceof NewsChannel))
		return;

	let content = '**Zapraszamy do oglądania!**';
	if (env.DC_ROLE_ID) content += ` <@&${env.DC_ROLE_ID}>`;

	await episodesChannel.send({
		embeds: [animeEmbed],
		content
	});
};

const botInit = async () => {
	client.on(Events.ClientReady, (readyClient) => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	});

	client.login(env.DC_BOT_TOKEN);
};

botInit();
