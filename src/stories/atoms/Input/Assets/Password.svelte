<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Eye, EyeClosed } from 'lucide-svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		inputClass?: string;
		buttonClass?: string;
	};

	let { class: className, inputClass, buttonClass, type, ...props }: Props = $props();

	const showPassword = () => {
		if (type == 'password') {
			type = 'text';
		} else {
			type = 'password';
		}
	};
</script>

<div class={cn('input-group grid-cols-[1fr_auto] divide-x divide-surface-200-800', className)}>
	<input class={cn(inputClass)} {...props} {type} />
	<button
		type="button"
		class={cn('input-group-cell preset-tonal-surface', buttonClass)}
		onclick={showPassword}
	>
		{#if type == 'password'}
			<EyeClosed size="20" />
		{:else}
			<Eye size="20" />
		{/if}
	</button>
</div>
