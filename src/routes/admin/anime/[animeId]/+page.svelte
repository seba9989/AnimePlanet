<script lang="ts">
	import { page } from '$app/state';
	import Cover from '$components/atoms/Cover/Cover.svelte';
	import Textarea from '$components/atoms/Textarea/Textarea.svelte';
	import Form from '$components/molecules/Form';
	import Confirm from '$components/molecules/Form/Assets/Confirm.svelte';
	import Input from '$components/atoms/Input/index.js';
	import { encodeUrl } from '$lib/utils/urlReadable';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { CircleX } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	let { data, form } = $props();
	let { anime: animeFull } = $derived(data);

	let allTags = $derived.by(() => data.tags.map(({ name }) => name));

	let { episodes, ...anime } = $derived(animeFull);

	let saveMode = $state(true);

	const changeMode = () => {
		return (saveMode = !saveMode);
	};

	let animeTags = $state(data.anime.tags.map(({ tag }) => tag));
	let newTag: string = $state(data.tags[0].name);

	const addTag = () => {
		const _newTag = $state.snapshot(newTag);

		const _animeTags = new Set([...animeTags, _newTag]);
		animeTags = [..._animeTags];
	};

	const removeTag = (tag: string) => {
		const _animeTags = new Set(animeTags);
		_animeTags.delete(tag);
		animeTags = [..._animeTags];
	};

	let openState = $state(false);

	let shouldDownloadJSON = $state(false);
	function downloadJSON() {
		const jsonString = JSON.stringify(form?.exportedAnime, null, 2);

		const blob = new Blob([jsonString], { type: 'application/json' });

		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = encodeUrl(anime.title);

		link.click();

		URL.revokeObjectURL(link.href);
	}

	$effect(() => {
		if (form && shouldDownloadJSON) {
			downloadJSON();
			shouldDownloadJSON = false;
		}
	});
</script>

<div>
	<Form
		class="flex flex-col gap-4"
		action="?/save"
		onAll={(event) => {
			if (event.action.search === '?/save') {
				changeMode();
			}
		}}
		onSuccess={(event) => {
			if (event.action.search === '?/exportToJson') {
				shouldDownloadJSON = true;
			}
		}}
		types={{
			tags: '[array]',
			embeds: '[array]',
			downloads: '[array]'
		}}
	>
		<div class="flex justify-between gap-4">
			<Form.Confirm class="btn preset-tonal" formaction="?/exportToJson" resetStyle>
				Export do JSON
			</Form.Confirm>
			<div>
				<Form.Confirm class="btn preset-tonal" formaction="?/sendAnime" resetStyle>
					Send Anime
				</Form.Confirm>
				{#if saveMode}
					<button onclick={changeMode} type="button" class="btn preset-filled">Edit</button>
				{:else}
					<Confirm class="btn preset-tonal-primary">Save</Confirm>
				{/if}
			</div>
		</div>
		<div class="grid grid-cols-[auto_1fr_1fr_1fr] gap-4">
			<Cover img={anime.coverImageUrl} class="min-w-60" />

			<div
				class="flex flex-col gap-4 divide-y border border-surface-200-800 divide-surface-200-800 *:grid *:gap-2 *:px-4 *:py-2"
			>
				<div>
					<h2 class="h4">Title</h2>
					<input
						type="text"
						class="input"
						bind:value={anime.title}
						name="title"
						disabled={saveMode}
					/>
				</div>
				<div>
					<h2 class="h4">Tags</h2>
					<Input.Tag disabled={saveMode} tags={animeTags} {allTags} />
				</div>
			</div>

			<label class="label flex flex-col">
				<span class="label-text">Embeds</span>
				<Textarea name="embeds" {episodes} disabled={saveMode} />
			</label>
			<label class="label flex flex-col">
				<span class="label-text">Downloads</span>
				<Textarea name="downloads" {episodes} disabled={saveMode} />
			</label>
		</div>
	</Form>

	<div class="table-wrap">
		<table class="table grid grid-cols-[auto_1fr_auto_auto_auto]">
			<thead class="col-span-5 grid grid-cols-subgrid items-center">
				<tr class="col-span-2 grid grid-cols-subgrid">
					<th>Np.</th>
					<th>Title</th>
				</tr>
				<tr class=" flex col-span-3 ml-auto">
					<th>
						<Form
							action="?/updateEpisodesList"
							staticValues={{
								animeMalId: anime.malId
							}}
						>
							<Form.Confirm class="preset-tonal-primary">Update Episode List</Form.Confirm>
						</Form>
					</th>
					<th>
						<Modal
							bind:open={openState}
							triggerBase="btn preset-tonal"
							contentClasses="w-md card w-[90%] max-w-screen-md p-4  shadow-xl bg-surface-100-900"
							backdropClasses="backdrop-blur-sm"
						>
							{#snippet trigger()}Create Episode{/snippet}
							{#snippet content()}
								<Form action="?/createEpisode" class="space-y-4">
									<header class="text-nowrap">
										<h2 class="h2">Create Episode</h2>
									</header>
									<div class="space-y-2">
										<input
											type="number"
											class="input"
											placeholder="Episode Number"
											name="episodeNumber"
										/>
										<input type="text" class="input" placeholder="Episode Title" name="title" />
									</div>
									<footer class="flex justify-end gap-4">
										<Form.Confirm>Create</Form.Confirm>
									</footer>
								</Form>
							{/snippet}
						</Modal>
					</th>
				</tr>
			</thead>
			<tbody class="col-span-5 grid grid-cols-subgrid hover:[&>tr]:backdrop-brightness-75">
				{#each episodes as episode}
					<tr class="col-span-5 grid grid-cols-subgrid items-center">
						<th class="font-mono">{episode.episodeNumber}</th>
						<th>{episode.title}</th>
						<th>
							<a href="{page.params.animeId}/{episode.id}" class="btn preset-tonal-primary">Edit</a>
						</th>
						<th>
							<Form
								action="?/removeEpisode"
								staticValues={{
									episodeId: episode.id
								}}
							>
								<Form.Confirm class="btn preset-tonal-error">Remove</Form.Confirm>
							</Form>
						</th>
						<th>
							<Form action="?/sendEpisode">
								<input
									class="hidden"
									type="checkbox"
									defaultChecked
									name="episodeId"
									value={episode.id}
								/>
								<Form.Confirm resetStyle class="btn preset-tonal">Send DC</Form.Confirm>
							</Form>
						</th>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<!-- <pre>{JSON.stringify(data.anime, null, 2)}</pre> -->
