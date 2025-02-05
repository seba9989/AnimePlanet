import { Client, EmbedBuilder, Events, GatewayIntentBits, type TextChannel } from 'discord.js';
import { db } from '../db';
import { env } from '$env/dynamic/private';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

if (!env.DC_BOT_TOKEN) throw new Error('DC_BOT_TOKEN is not set');
if (!env.DC_EPISODES_CHANNEL) throw new Error('DC_EPISODES_CHANNEL is not set');

client.on(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(env.DC_BOT_TOKEN);

export const send = async (episodeId: string, originUrl: string) => {
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
		.setURL(`${originUrl}/anime/${episode.animeId}`)
		.setDescription(`Tytuł: ${episode.title}`)
		.setImage(episode.anime.coverImageUrl)
		.setTimestamp()
		.setFooter({ text: 'AnimePlanet', iconURL: `${originUrl}/favicon.png` });

	const episodesChannel = (await client.channels.fetch(env.DC_EPISODES_CHANNEL)) as TextChannel;
	await episodesChannel.send({ embeds: [episodeEmbed] });
};
