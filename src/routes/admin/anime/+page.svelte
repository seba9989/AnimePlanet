<script lang="ts">
	import { page } from '$app/state';
	import Search from '$components/atoms/Input/Search/Search.svelte';
	import Confirm from '$components/molecules/Form/Assets/Confirm.svelte';
	import Form from '$components/molecules/Form/Form.svelte';
	import { animeListByTitle } from '$lib/apiHandlers/aniList';
	import { createAnimeIndex, searchAnimeIndex } from '$lib/search';
	import type { PageData } from './$types';
	import { Accordion, Modal } from '@skeletonlabs/skeleton-svelte';
	import { ArrowUpRight } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let anime = $state(data.anime);

	let title = $state('');

	let openState = $state(false);

	function modalClose() {
		openState = false;
	}
	$effect(() => {
		createAnimeIndex(data.anime);
	});
	$effect(() => {
		const title = page.url.searchParams.get('title');
		const tags = page.url.searchParams.get('tags')?.split(',');
		anime = searchAnimeIndex(title, tags) ?? [];
	});
</script>

<div class="flex items-center justify-between">
	<Search
		wrapperClass="w-full max-w-2xl"
		placeholder="Szukany tytuł"
		setQueryParam={{
			name: 'title'
		}}
	/>
	<Modal
		bind:open={openState}
		triggerBase="btn preset-tonal"
		contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl w-md  w-[90%] max-w-screen-md"
		backdropClasses="backdrop-blur-sm"
	>
		{#snippet trigger()}Add Anime{/snippet}
		{#snippet content()}
			<header class="flex justify-between">
				<h2 class="h2">Add Anime</h2>
			</header>
			<Form action="?/addAnime" class="flex flex-col gap-4" onAll={modalClose}>
				<div class="input-group grid-flow-row divide-x divide-surface-200-800">
					<input
						name="title"
						type="text"
						bind:value={title}
						placeholder="Ore dake Level Up na Ken: Season 2 - Arise from the Shadow"
					/>
				</div>
				<select class="select overflow-auto" name="malId" size="4" value="1">
					{#await animeListByTitle(title)}
						{#each new Array(4) as _}
							<option class="">&nbsp;</option>
						{/each}
					{:then anime}
						{#if anime.length > 0}
							{#each anime as anime}
								<option value={anime?.idMal}>{anime?.title?.romaji}</option>
							{/each}
						{:else}
							{#each new Array(4) as _}
								<option class="">&nbsp;</option>
							{/each}
						{/if}
					{/await}
				</select>

				<div class="ml-auto flex gap-4">
					<button type="button" class="btn preset-tonal" onclick={modalClose}>Cancel</button>
					<Confirm>Confirm</Confirm>
				</div>
			</Form>
		{/snippet}
	</Modal>
</div>

{#if anime[0]}
	<Accordion collapsible>
		{#each anime as anime}
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
										{#if anime.malId}
											<Form action="?/updateEpisodesList" onAll={modalClose}>
												<input
													type="checkbox"
													checked
													class="hidden"
													name="animeId"
													value={anime.id}
												/>
												<input
													type="checkbox"
													checked
													class="hidden"
													name="malId"
													value={anime.malId}
												/>
												<Confirm>Update list</Confirm>
											</Form>
										{/if}
									</th>
								</tr>
							</thead>
							<tbody class="hover:[&>tr]:preset-tonal-primary">
								{#each anime.episodes as { episodeNumber, title, id }}
									<tr>
										<td>
											{episodeNumber}
										</td>
										<td>{title}</td>
										<td><input type="text" class="input" form={id} name="videoUrl" /></td>
										<td><input type="text" class="input" form={id} name="downloadUrl" /></td>
										<td class="!text-right">
											<Form action="?/addLinkToEpisode" {id}>
												<input type="text" class="hidden" value={id} name="episodeId" />
												<Confirm>Add link</Confirm>
											</Form>
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
