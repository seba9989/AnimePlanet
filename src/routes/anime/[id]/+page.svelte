<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { PageData } from './$types';
	import Player from '$components/atoms/Player/Player.svelte';
	import Cover from '$components/atoms/Cover/Cover.svelte';

	let { data }: { data: PageData } = $props();

	const { coverImageUrl, title, episodes } = data.anime;
	console.log(data.anime);
</script>

<div class="flex gap-4">
	<div>
		<Cover class="hidden w-96 xl:flex" img={coverImageUrl} />
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
