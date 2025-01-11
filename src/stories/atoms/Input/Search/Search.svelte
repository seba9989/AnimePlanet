<script lang="ts">
	import { browser } from '$app/environment';
	import { goto, replaceState, pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { cn } from '$lib/utils/cn';
	import { redirect } from '@sveltejs/kit';
	import { Search } from 'lucide-svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		wrapperClass?: string;
	}

	let { wrapperClass, ...props }: Props = $props();
	let searchTitle = $state('');
	const updateUrl = () => {
		page.url.searchParams.set('title', searchTitle);
		goto(`/anime?${page.url.searchParams.toString()}`, { keepFocus: true });
	};
</script>

<div class={cn('input-group grid-cols-[1fr_auto] divide-x divide-surface-200-800', wrapperClass)}>
	<input {...props} placeholder="Już wkrótce..." bind:value={searchTitle} onkeyup={updateUrl} />

	<button onclick={updateUrl} class="input-group-cell preset-tonal-surface">
		<Search size="20" />
	</button>
</div>
