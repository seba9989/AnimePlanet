<script lang="ts">
	import { page } from '$app/state';
	import Search from '$components/atoms/Input/Search/Search.svelte';
	import Form from '$components/molecules/Form';
	import { animeListByTitle } from '$lib/apiHandlers/aniList';
	import { createAnimeIndex, searchAnimeIndex } from '$lib/search';
	import type { PageData } from './$types';
	import { FileUpload, Modal } from '@skeletonlabs/skeleton-svelte';
	import { ArrowUpRight } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let anime = $state(data.anime);

	let title = $state('');
	let searchedAnime = $state<Awaited<ReturnType<typeof animeListByTitle>>>();

	$effect(() => {
		animeListByTitle(title ?? undefined).then((v) => (searchedAnime = v));
	});

	let addAnimeOS = $state(false);
	let importAnimeOS = $state(false);

	function modalClose() {
		importAnimeOS = false;
		addAnimeOS = false;
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
	<div class="space-x-4">
		<Modal
			bind:open={importAnimeOS}
			triggerBase="btn preset-tonal"
			contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl w-md  w-[90%] max-w-screen-md"
			backdropClasses="backdrop-blur-sm"
		>
			{#snippet trigger()}Import Anime{/snippet}
			{#snippet content()}
				<header class="flex justify-between">
					<h2 class="h2">Import Anime</h2>
				</header>
				<Form
					action="?/importAnime"
					class="flex flex-col gap-4"
					onSuccess={modalClose}
					enctype="multipart/form-data"
				>
					<FileUpload
						name="animeJson"
						accept="application/json"
						maxFiles={10}
						onFileChange={console.log}
						onFileReject={console.error}
						classes="w-full"
					/>
					<Form.Confirm class="w-fit ml-auto">Confirm</Form.Confirm>
				</Form>
			{/snippet}
		</Modal>
		<Modal
			bind:open={addAnimeOS}
			triggerBase="btn preset-tonal"
			contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl w-md  w-[90%] max-w-screen-md"
			backdropClasses="backdrop-blur-sm"
		>
			{#snippet trigger()}Add Anime{/snippet}
			{#snippet content()}
				<header class="flex justify-between">
					<h2 class="h2">Add Anime</h2>
				</header>
				<Form action="?/addAnime" class="flex flex-col gap-4" onSuccess={modalClose}>
					<div class="input-group grid-flow-row divide-x divide-surface-200-800">
						<input
							name="title"
							type="text"
							bind:value={title}
							placeholder="Ore dake Level Up na Ken: Season 2 - Arise from the Shadow"
						/>
					</div>
					<select class="select overflow-auto" name="malId" size="4" value="1">
						{#if searchedAnime && searchedAnime.length > 0}
							{#each searchedAnime as anime}
								<option value={anime?.idMal}>{anime?.title?.romaji}</option>
							{/each}
						{/if}
					</select>

					<div class="ml-auto flex gap-4">
						<button type="button" class="btn preset-tonal" onclick={modalClose}>Cancel</button>
						<Form.Confirm>Confirm</Form.Confirm>
					</div>
				</Form>
			{/snippet}
		</Modal>
	</div>
</div>

{#if anime.length > 0}
	<div class="table-wrap">
		<table class="table caption-bottom">
			<thead>
				<tr>
					<th>Open</th>
					<th>Title</th>
					<th class="!text-right">Actions</th>
				</tr>
			</thead>
			<tbody class="hover:[&>tr]:backdrop-brightness-75">
				{#each anime as anime}
					<tr>
						<th>
							<a href="anime/{anime.id}" class="btn-icon preset-tonal"><ArrowUpRight /></a>
						</th>
						<th>{anime.title}</th>
						<th class="flex justify-end">
							<Form
								action="?/removeAnime"
								staticValues={{
									id: anime.id
								}}
							>
								<Form.Confirm class="preset-tonal-error">Remove</Form.Confirm>
							</Form>
						</th>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<td colspan="2">Total</td>
					<td class="text-right">{anime.length} Anime</td>
				</tr>
			</tfoot>
		</table>
	</div>
{:else}
	<h2 class="h1 m-auto">Nie ma jeszcze żadnych anime.</h2>
{/if}
