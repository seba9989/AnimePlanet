<script>
	import Cover from '$components/atoms/Cover/Cover.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col gap-2">
	<h2 class="h3">Serie</h2>
	{#if data.anime}
		{@const anime = data.anime}
		<div class="grid gap-4 grid-grow-36 md:grid-grow-44">
			{#each anime as anime (anime.title)}
				<div class="max-w-60">
					<Cover img={anime.coverImageUrl} title={anime.title} href="/anime/{anime.id}" />
				</div>
			{/each}
		</div>
	{/if}
</div>
