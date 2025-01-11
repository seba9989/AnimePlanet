<script lang="ts">
	import { Accordion, Modal } from '@skeletonlabs/skeleton-svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import { ArrowUpRight } from 'lucide-svelte';

	let embeds: { body: string }[] = $state([{ body: '' }]);
	let downloads: { body: string }[] = $state([{ body: '' }]);

	let { data }: { data: PageData } = $props();

	// let group = $state([data.anime[0].title]);
	let openState = $state(false);

	function modalClose() {
		openState = false;
	}
</script>

<div class="ml-auto">
	<Modal
		bind:open={openState}
		triggerBase="btn preset-tonal"
		contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
		backdropClasses="backdrop-blur-sm"
	>
		{#snippet trigger()}Add Anime{/snippet}
		{#snippet content()}
			<header class="flex justify-between">
				<h2 class="h2">Add Anime</h2>
			</header>
			<form action="?/addAnime" method="post" class="flex flex-col gap-4">
				<input
					name="title"
					type="text"
					class="input"
					placeholder="Ore dake Level Up na Ken: Season 2 - Arise from the Shadow"
				/>
				<div class="ml-auto flex gap-4">
					<button type="button" class="btn preset-tonal" onclick={modalClose}>Cancel</button>
					<button type="submit" class="btn preset-filled">Confirm</button>
				</div>
			</form>
		{/snippet}
	</Modal>
</div>

{#if data.anime[0]}
	<Accordion value={[data.anime[0].title]} collapsible>
		{#each data.anime as anime}
			<hr class="hr" />
			<Accordion.Item value={anime.title}>
				{#snippet lead()}<a href="anime/{anime.id}" class="btn-icon preset-tonal"
						><ArrowUpRight /></a
					>{/snippet}
				{#snippet control()}{anime.title}{/snippet}
				<!-- Panel -->
				{#snippet panel()}
					<div class="table-wrap">
						<table class="table caption-bottom">
							<thead>
								<tr>
									<th>Np.</th>
									<th>Title</th>
									<th>Video</th>
									<th>Download</th>
									<th class="!text-right">
										<form action="?/updateEpisodesList" method="post" use:enhance>
											<input type="text" class="hidden" name="animeId" value={anime.id} />
											<input type="text" class="hidden" name="animeTitle" value={anime.title} />
											<button class="btn preset-filled">Update list</button>
										</form>
									</th>
								</tr>
							</thead>
							<tbody class="hover:[&>tr]:preset-tonal-primary">
								{#each anime.episodes as { episodeNumber, title, id }}
									<tr>
										<td> {episodeNumber}</td>
										<td>{title}</td>
										<td><input type="text" class="input" form={id} name="videoUrl" /></td>
										<td><input type="text" class="input" form={id} name="downloadUrl" /></td>
										<td class="!text-right">
											<form action="?/addLinkToEpisode" {id} method="post">
												<input type="text" class="hidden" value={id} name="episodeId" />
												<button class="btn preset-tonal">Add link</button>
											</form>
										</td>
									</tr>
								{/each}
								<tr></tr>
							</tbody>
						</table>
					</div>
				{/snippet}
			</Accordion.Item>
		{/each}
		<hr class="hr" />
	</Accordion>
{:else}
	<h2 class="h1 m-auto">Nie ma jeszcze żadnych anime.</h2>
{/if}
