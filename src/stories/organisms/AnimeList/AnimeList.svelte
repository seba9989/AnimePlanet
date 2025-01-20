<script lang="ts">
	import Cover from '$components/atoms/Cover/Cover.svelte';
	import type { Anime, TagsInAnime } from '$lib/server/db/schema';
	import { flip } from 'svelte/animate';
	import { scale } from 'svelte/transition';

	interface AnimeWithTags extends Anime {
		tags?: TagsInAnime[];
	}

	let { anime }: { anime: AnimeWithTags[] } = $props();
</script>

<div class="grid gap-4 grid-grow-36 md:grid-grow-44">
	{#each anime as anime (anime.title)}
		<div animate:flip={{ duration: 500 }} in:scale={{ duration: 500 }}>
			<Cover img={anime.coverImageUrl} title={anime.title} href="/anime/{anime.id}" />
		</div>
	{/each}
</div>
