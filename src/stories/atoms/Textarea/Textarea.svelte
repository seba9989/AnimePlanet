<script lang="ts">
	import type { Episode } from '$lib/server/db/schema';
	import { cn } from '$lib/utils/cn';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Props = { episodes: Episode[]; name: string } & HTMLTextareaAttributes;

	let { episodes, name, ...props }: Props = $props();

	let minLines = $derived(episodes.length);

	let text = $state('');

	let textLines = $derived.by(() => text.split('\n'));

	$effect(() => {
		while (textLines.length < minLines) {
			textLines.push('');
			text = textLines.join('\n');
		}
		while (textLines.length > minLines && textLines.at(-1)?.trim() == '') {
			console.log('test');

			if (textLines.at(-1)?.trim() == '') {
				console.log(textLines.at(-1)?.trim() === '');

				textLines.pop();
				console.log(textLines);

				text = textLines.join('\n');
			}
		}
	});

	$effect(() => {
		text ||= Array(minLines).fill('').join('\n');
	});
</script>

<div class={cn(['input-group flex overflow-hidden font-mono'], props.disabled && '!brightness-50')}>
	<div class="select-none px-2 py-1 text-right">
		{#each textLines as textLine, i}
			{#if i >= episodes.length}
				<div class="preset-tonal-error grid place-items-center">!</div>
			{:else}
				<div>{episodes[i].episodeNumber}</div>
				<input
					class="hidden"
					type="checkbox"
					defaultChecked={!(textLine.trim() === '')}
					defaultValue={JSON.stringify({
						episodeId: episodes[i].id,
						url: textLine
					})}
					{name}
				/>
			{/if}
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
