<script lang="ts">
	import { enhance } from '$app/forms';
	import Cover from '$components/atoms/Cover/Cover.svelte';
	import { CircleX } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	const { anime, tags } = data;

	let saveMode = $state(true);
	const changeMode = () => {
		console.log(animeTags);

		return (saveMode = !saveMode);
	};

	let animeTags = $state(anime.tags.map(({ tag }) => tag));
	let newTag: string = $state(tags[0].name);

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

<!-- <pre>{JSON.stringify(data.anime, null, 2)}</pre> -->
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
<!-- <div>Test {JSON.stringify(page.params)}</div> -->
