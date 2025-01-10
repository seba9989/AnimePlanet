<script>
	import Logo from '$components/atoms/Logo/Logo.svelte';
	import Cover from '$components/atoms/Cover/Cover.svelte';
	import ThreeDCover from '$components/molecules/ThreeDCover/ThreeDCover.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col gap-2">
	<h2 class="h3">Serie</h2>
	<div class="flex gap-4">
		{#each data.anime as { id, coverImageUrl, title }}
			<ThreeDCover href="/anime/{id}" img={coverImageUrl} {title} />
		{/each}
	</div>
</div>