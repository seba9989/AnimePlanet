<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { PageData } from './$types';
	import Player from '$components/atoms/Player/Player.svelte';
	import Cover from '$components/atoms/Cover/Cover.svelte';

	let { data }: { data: PageData } = $props();

	const { coverImageUrl, title, episodes } = data.anime;
	const { season, duration, year, status } = data.malData;

	function capitalizeFirstLetter(str: string) {
		console.log(str);

		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase());
	}

	console.log(data.anime.tags);

	const bonusData = [
		{ name: 'Season', data: `${season} ${year}` },
		{ name: 'Duration', data: duration },
		{ name: 'Episodes', data: episodes.length },
		{ name: 'Status', data: status },
		{ name: 'Genres', data: data.anime.tags.map((v) => v.tag).join(',<br/>') }
	];
</script>

<div class="flex gap-4">
	<div class="h-fit preset-tonal">
		<Cover class="hidden w-96 xl:flex" img={coverImageUrl} />

		<div class="table-wrap">
			<table class="table">
				<tbody class="hover:[&>tr]:preset-tonal-primary">
					{#each bonusData as { name, data }}
						<tr>
							<td class="align-top">{name}</td>
							<td>{@html capitalizeFirstLetter(data?.toString() ?? '')}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
	<div class="flex w-full flex-col items-center">
		<h1 class="h5 text-pretty text-center md:h2">{title}</h1>
		<Accordion multiple>
			{#each episodes as episode}
				<hr class="hr" />
				<Accordion.Item value={episode.id}>
					<!-- Control -->
					{#snippet lead()}{episode.episodeNumber}{/snippet}
					{#snippet control()}{episode.title}{/snippet}
					<!-- Panel -->
					{#snippet panel()}
						{#if episode.videos[0]}
							<Player {episode}></Player>
						{:else}
							<div class="w-full">
								<p class="label-text m-auto w-fit">Odcinek nie jest jeszcze dostępny</p>
							</div>
						{/if}
					{/snippet}
				</Accordion.Item>
			{/each}
			<hr class="hr" />
		</Accordion>
	</div>
</div>
