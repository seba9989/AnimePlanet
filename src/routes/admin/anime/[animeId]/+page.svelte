<script lang="ts">
	import { page } from '$app/state';
	import Confirm from '$components/molecules/Form/Assets/Confirm.svelte';
	import Cover from '$components/atoms/Cover/Cover.svelte';
	import Textarea from '$components/atoms/Textarea/Textarea.svelte';
	import Form from '$components/molecules/Form';
	import type { Link } from '$lib/server/db/schema.js';
	import { urlToHosting } from '$lib/utils/urlToHosting.js';
	import { CircleX, Send } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { Modal } from '@skeletonlabs/skeleton-svelte';

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

	let openState = $state(false);

	$inspect(openState);
</script>

<div>
	<Form
		class="flex flex-col gap-4"
		action="?/save"
		onAll={changeMode}
		types={{
			tags: '[array]'
		}}
	>
		{#if saveMode}
			<button onclick={changeMode} type="button" class="btn ml-auto preset-filled">Edit</button>
		{:else}
			<Confirm class="btn ml-auto preset-tonal-primary">Save</Confirm>
		{/if}
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
								<input checked type="checkbox" value={tag} name="tags" class="hidden" />
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
				<Textarea name="embeds" {episodes} disabled={saveMode} />
			</label>
			<label class="label flex flex-col">
				<span class="label-text">Downloads</span>
				<Textarea name="downloads" {episodes} disabled={saveMode} />
			</label>
		</div>
	</Form>

	{#snippet linksTable(type: string, links: Link[])}
		<div class="table-wrap">
			<table class="table caption-bottom">
				<thead>
					<tr>
						<th>{type}s</th>
						<th>Hosting</th>
						<th>Link</th>
						<th></th>
					</tr>
				</thead>
				<tbody class="hover:[&>tr]:preset-tonal-primary">
					{#each links as link, i}
						<tr>
							<td> {i}</td>
							<td>{urlToHosting(link.url)}</td>
							<td><a href={link.url} class="anchor">{link.url}</a></td>
							<td class="!text-right">
								<Form action="?/remove{type}" id={link.id}>
									<input type="checkbox" class="hidden" checked value={link.id} name="id" />
									<button class="btn preset-tonal" type="submit">Remove link</button>
								</Form>
							</td>
						</tr>
					{/each}
					<tr></tr>
				</tbody>
			</table>
		</div>
	{/snippet}

	<div class="table-wrap">
		<table class="table grid grid-cols-[auto_1fr_auto_auto_auto]">
			<thead class="col-span-5 grid grid-cols-subgrid items-center">
				<tr class="col-span-3 grid grid-cols-subgrid">
					<th>Np.</th>
					<th>Title</th>
				</tr>
				<tr class="col-span-2 ml-auto">
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
						<th>{episode.episodeNumber}</th>
						<th>{episode.title}</th>
						<th>
							<a href="{page.params.animeId}/{episode.id}" class="btn preset-tonal-primary">Edit</a>
						</th>
						<th>
							<Form action="?/removeEpisode">
								<input class="hidden" type="checkbox" defaultChecked name="id" value={episode.id} />
								<button class="btn preset-tonal-error">Remove</button>
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
