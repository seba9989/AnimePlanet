<script>
	import Cover from '$components/atoms/Cover/Cover.svelte';
	import AnimeList from '$components/organisms/AnimeList/AnimeList.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col gap-2">
	<h2 class="h3">Serie</h2>
	{#if data.anime}
		<AnimeList anime={data.anime} />
	{/if}
</div>
