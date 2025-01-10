<script lang="ts">
	import ThreeDCover from '$components/molecules/ThreeDCover/ThreeDCover.svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { coverImageUrl, title, episodes } = data.anime;
	// console.log(data.anime);
	let iframe: HTMLIFrameElement;

	const FakeWindow = {
		blur: function () {
			return false;
		},
		focus: function () {
			return false;
		}
	};
</script>

<div class="flex gap-4">
	<ThreeDCover img={coverImageUrl} />
	<div class="flex w-full flex-col items-center">
		<h1 class="h2">{title}</h1>
		<Accordion multiple>
			{#each episodes as episode}
				<hr class="hr" />
				<Accordion.Item value={episode.id}>
					<!-- Control -->
					{#snippet lead()}{episode.episodeNumber}{/snippet}
					{#snippet control()}{episode.title}{/snippet}
					<!-- Panel -->
					{#snippet panel()}
						{#if !episode.videos[0]}
							<div>Odcinek nie został jeszcze dodany</div>
						{:else}
							<iframe
								class="aspect-video w-full max-w-[620px]"
								style="border:none;"
								frameBorder="0"
								scrolling="no"
								allowfullscreen
								name="v2"
								allow="*"
								title={episode.videos[0].id}
								src={episode.videos[0].url}
							></iframe>
						{/if}
					{/snippet}
				</Accordion.Item>
			{/each}
			<hr class="hr" />
		</Accordion>
	</div>
</div>
