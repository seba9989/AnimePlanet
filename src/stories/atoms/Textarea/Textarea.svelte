<script lang="ts">
	import type { Episode } from '$lib/server/db/schema';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Props = { episodes: Episode[] } & HTMLTextareaAttributes;

	let { episodes, name, ...props }: Props = $props();

	const minLines = episodes.length;

	let text = $state(Array(minLines).fill('').join('\n'));

	console.log(minLines);

	let textLines = $derived(text.split('\n'));

	$effect(() => {
		text ||= Array(minLines).fill('').join('\n');
	});
</script>

<div class="input-group flex overflow-hidden font-mono">
	<div class="select-none px-2 py-1 text-right">
		{#each episodes as { id, episodeNumber }, index}
			<div>{episodeNumber}</div>
			<input
				class="hidden"
				type="checkbox"
				checked={!!textLines[index]}
				value={JSON.stringify({
					episodeId: id,
					url: textLines[index]
				})}
				{name}
			/>
		{/each}
	</div>

	<textarea
		class="textarea h-full resize-none overflow-auto text-nowrap p-1"
		{...props}
		bind:value={text}
		rows={textLines.length}
		spellcheck="false"
	></textarea>
</div>
