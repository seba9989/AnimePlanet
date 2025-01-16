<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { cn } from '$lib/utils/cn';
	import { setQueryParam } from '$lib/utils/queryParams';
	import { Search } from 'lucide-svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		wrapperClass?: string;
	}

	let { wrapperClass, onclick, ...props }: Props = $props();
	let title: string = $state('');

	$effect(() => {
		title = page.url.searchParams.get('title') ?? '';
	});
</script>

<div class={cn('input-group grid-cols-[1fr_auto] divide-x divide-surface-200-800', wrapperClass)}>
	<input
		{...props}
		bind:value={title}
		placeholder="Już wkrótce..."
		onkeyup={() => setQueryParam('title', title)}
	/>

	<button
		onclick={() => {
			setQueryParam('title', title);
			// @ts-expect-error
			onclick();
		}}
		class="input-group-cell preset-tonal-surface"
	>
		<Search size="20" />
	</button>
</div>
