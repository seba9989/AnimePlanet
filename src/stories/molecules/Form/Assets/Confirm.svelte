<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { LoaderCircle } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const {
		children,
		class: className,
		resetStyle = false,
		...props
	}: HTMLButtonAttributes & { resetStyle?: boolean } = $props();

	let form = getContext<{ isLoad: boolean }>('form');
</script>

<button type="submit" class={cn(!resetStyle && 'btn preset-filled', className)} {...props}>
	{#if form.isLoad}
		<LoaderCircle class="animate-spin" />
	{:else}
		{@render children?.()}
	{/if}
</button>
