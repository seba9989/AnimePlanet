<script lang="ts">
	import { page } from '$app/state';
	import { createAnimeIndex, searchAnimeIndex } from '$lib/search';
	import type { Anime } from '$lib/server/db/schema';
	import { setQueryParam } from '$lib/utils/queryParams';
	import { flip } from 'svelte/animate';
	import type { PageData } from './$types';
	import { scale } from 'svelte/transition';
	import Search from '$components/atoms/Input/Search/Search.svelte';
	import Cover from '$components/atoms/Cover/Cover.svelte';
	import AnimeList from '$components/organisms/AnimeList/AnimeList.svelte';

	let { data }: { data: PageData } = $props();

	let anime: Anime[] | undefined = $state(data.anime);

	createAnimeIndex(data.anime);

	let selectedTags: { [x: string]: boolean } = $state({});
	$effect(() => {
		const title = page.url.searchParams.get('title');
		const tags = page.url.searchParams.get('tags')?.split(',');

		anime = searchAnimeIndex(title, tags);
	});

	const tagsChange = () => {
		let tags: string[] = [];
		for (const tag in selectedTags) {
			if (selectedTags[tag]) {
				console.log(tag);
				tags = [tag, ...tags];
			}
		}

		setQueryParam('tags', tags.toString());
	};
</script>

<Search />

<form class="flex flex-wrap gap-4">
	{#each data.tags as tag, i}
		<label class="flex items-center space-x-2">
			<input
				bind:checked={selectedTags[tag.name]}
				onchange={tagsChange}
				class="checkbox"
				type="checkbox"
			/>
			<p>{tag.name}</p>
		</label>
	{/each}
</form>

{#if anime}
	<AnimeList {anime} />
{/if}
