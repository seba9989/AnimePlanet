<script lang="ts">
	import { CircleX } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	type Props = {
		name: string
		tags?: string[];
		allTags: string[];
		disabled?: boolean;
	};

	let {name, tags = $bindable([]), allTags = $bindable(), disabled }: Props = $props();

	let newTag = $state(allTags[0]);

	const addTag = () => {
		const _newTag = $state.snapshot(newTag);

		const _animeTags = new Set([...tags, _newTag]);

		tags = [..._animeTags];
	};

	const removeElement = (tag: string) => {
		const _tags = new Set(tags);
		_tags.delete(tag);
		tags = [..._tags];
	};
</script>

<div class="space-y-2">
	<div class="flex flex-wrap gap-4">
		{#each tags as tag, i (i)}
			<button
				animate:flip={{ duration: 500 }}
				in:fly={{ duration: 500, x: 50 }}
				class="badge preset-filled"
				onclick={() => removeElement(tag)}
				{disabled}
				type="button"
			>
				<CircleX size="16" />
				<span>
					{tag}
				</span>
				<input type="checkbox" defaultChecked defaultValue={tag} {name} class="hidden" />
			</button>
		{/each}
	</div>
	<div class="input-group grid-cols-[1fr_auto] divide-x divide-surface-200-800">
		<select class="select" bind:value={newTag} {disabled}>
			{#each allTags as tag}
				<option value={tag}>{tag}</option>
			{/each}
		</select>
		<button class="input-group-cell preset-tonal-surface" {disabled} onclick={addTag} type="button">
			Add
		</button>
	</div>
</div>
