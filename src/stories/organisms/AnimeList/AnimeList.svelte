<script lang="ts">
	import Cover from '$components/atoms/Cover/Cover.svelte';
	import type { Anime, TagsInAnime } from '$lib/server/db/schema';

	interface AnimeWithTags extends Anime {
		tags?: TagsInAnime[];
	}

	let { anime }: { anime: AnimeWithTags[] } = $props();
</script>

<div class="grid gap-4 grid-grow-36 md:grid-grow-44">
	{#each anime as anime (anime.title)}
		<Cover img={anime.coverImageUrl} title={anime.title} href="/anime/{anime.id}" />
	{/each}
</div>
