<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { LoaderCircle } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const { children, class: className, ...props }: HTMLButtonAttributes = $props();

	let form = getContext<{ isLoad: boolean }>('form');
</script>

<button type="submit" class={cn('btn preset-filled', className)} {...props}>
	{#if form.isLoad}
		<LoaderCircle class="animate-spin" />
	{:else}
		{@render children?.()}
	{/if}
</button>
