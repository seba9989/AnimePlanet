<script lang="ts">
	import { page } from '$app/state';
	import ThreeDCover from '$components/molecules/ThreeDCover/ThreeDCover.svelte';
	import { createAnimeIndex, searchAnimeIndex } from '$lib/search';
	import type { Anime } from '$lib/server/db/schema';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let anime: Anime[] | undefined = $state(data.anime);

	$effect(() => {
		const title = page.url.searchParams.get('title');

		createAnimeIndex(data.anime);
		anime = searchAnimeIndex(title);
	});
</script>

{#if anime}
	<div class="flex gap-4">
		{#each anime as anime}
			<ThreeDCover img={anime.coverImageUrl} title={anime.title} href="/anime/{anime.id}" />
		{/each}
	</div>
{/if}
