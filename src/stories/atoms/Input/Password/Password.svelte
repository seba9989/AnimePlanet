<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Eye, EyeClosed } from 'lucide-svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		wrapperClass?: string;
	}

	let { type, ...props }: Props = $props();

	const { wrapperClass, class: className } = props;

	const showPassword = () => {
		if (type == 'password') {
			type = 'text';
		} else {
			type = 'password';
		}
	};
</script>

<div class={cn('input-group grid-cols-[1fr_auto] divide-x divide-surface-200-800', wrapperClass)}>
	<input {...props} {type} />
	<button
		type="button"
		class={cn('input-group-cell preset-tonal-surface', className)}
		onclick={showPassword}
	>
		{#if type == 'password'}
			<EyeClosed size="20" />
		{:else}
			<Eye size="20" />
		{/if}
	</button>
</div>
