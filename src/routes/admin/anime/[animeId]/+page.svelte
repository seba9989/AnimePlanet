<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import Cover from '$components/atoms/Cover/Cover.svelte';
	import { urlToHosting } from '$lib/utils/urlToHosting.js';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import { CircleX } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let {
		anime: { episodes, ...anime },
		tags
	} = $derived(data);

	let saveMode = $state(true);
	const changeMode = () => {
		console.log(animeTags);

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
</script>

<form
	class="flex flex-col gap-4"
	action="?/save"
	method="post"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type == 'success') {
				changeMode();
			}
		};
	}}
>
	{#if saveMode}
		<button onclick={changeMode} type="button" class="btn ml-auto preset-filled">Edit</button>
	{:else}
		<button type="submit" class="btn ml-auto preset-tonal-primary">Save</button>
	{/if}
	<div class="grid grid-cols-[auto_1fr_1fr_1fr] gap-4">
		<Cover img={anime.coverImageUrl} />

		<div
			class="flex flex-col gap-4 divide-y border border-surface-200-800 divide-surface-200-800 *:grid *:gap-2 *:px-4 *:py-2"
		>
			<div>
				<h2 class="h4">Title</h2>
				<input type="text" class="input" value={anime.title} name="title" disabled={saveMode} />
			</div>
			<div>
				<h2 class="h4">Tags</h2>
				<div class="flex flex-wrap gap-4">
					{#each animeTags as tag (tag)}
						<button
							animate:flip={{ duration: 500 }}
							in:fly={{ duration: 500, x: 50 }}
							class="badge preset-filled"
							onclick={() => removeTag(tag)}
							disabled={saveMode}
							type="button"
						>
							<CircleX size="16" />
							<span>
								{tag}
							</span>
							<input checked type="checkbox" value={tag} name="tag" class="hidden" />
						</button>
					{/each}
				</div>
				<div class="input-group grid-cols-[1fr_auto] divide-x divide-surface-200-800">
					<select class="select" bind:value={newTag} disabled={saveMode}>
						{#each tags as { name }}
							<option value={name}>{name}</option>
						{/each}
					</select>
					<button
						class="input-group-cell preset-tonal-surface"
						disabled={saveMode}
						onclick={addTag}
						type="button"
					>
						Add
					</button>
				</div>
			</div>
		</div>

		<label class="label flex flex-col">
			<span class="label-text">Embeds</span>
			<textarea
				class="textarea h-full overflow-visible"
				name="embeds"
				placeholder="Don't work yet."
				disabled
			></textarea>
		</label>
		<label class="label flex flex-col">
			<span class="label-text">Downloads</span>
			<textarea
				class="textarea h-full overflow-visible"
				name="downloads"
				placeholder="Don't work yet."
				disabled
			></textarea>
		</label>
	</div>
</form>

<Accordion collapsible>
	{#each episodes as episode}
		<hr class="hr" />
		<Accordion.Item value={episode.id}>
			{#snippet lead()}
				<form action="?/sendEpisode" method="post" use:enhance>
					<input checked type="radio" class="hidden" value={episode.id} name="episodeId" />
					<button class="btn preset-tonal">Send to discord</button>
				</form>
			{/snippet}
			{#snippet control()}{episode.title}{/snippet}
			<!-- Panel -->
			{#snippet panel()}
				<div class="table-wrap">
					<table class="table caption-bottom">
						<thead>
							<tr>
								<th>Np.</th>
								<th>Hosting</th>
								<th>Link</th>
								<th></th>
							</tr>
						</thead>
						<tbody class="hover:[&>tr]:preset-tonal-primary">
							{#each episode.videos as video, i}
								<tr>
									<td> {i}</td>
									<td>{urlToHosting(video.url)}</td>
									<td><a href={video.url} class="anchor">{video.url}</a></td>
									<td class="!text-right">
										<form
											action="?/removeLink"
											id={video.id}
											method="post"
											use:enhance={() => {
												return async ({ result }) => {
													if (result.type == 'success') {
														goto(page.url.pathname, {
															invalidateAll: true,
															keepFocus: true,
															noScroll: true
														});
													}
												};
											}}
										>
											<input type="radio" class="hidden" checked value={video.id} name="videoId" />
											<button class="btn preset-tonal" type="submit">Remove link</button>
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
</Accordion>

<!-- <pre>{JSON.stringify(data.anime, null, 2)}</pre> -->
