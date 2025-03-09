<script lang="ts">
	import { page } from '$app/state';
	import type { Prettify } from '$lib/types/pretty';
	import { cn } from '$lib/utils/cn';
	import { setQueryParam, type SetQueryParamConfig } from '$lib/utils/queryParams';
	import { Search } from 'lucide-svelte';
	import type { HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		inputClass?: string;
		buttonClass?: string;
		setQueryParam: Prettify<Omit<SetQueryParamConfig, 'value'>>;
		onclick?: HTMLButtonAttributes['onclick'];
	};

	let {
		class: className,
		inputClass,
		buttonClass,
		onclick,
		setQueryParam: setQueryParamConfig,
		...props
	}: Props = $props();
	let value: string = $state('');

	$effect(() => {
		if (!setQueryParamConfig.pathname || page.url.pathname === setQueryParamConfig.pathname) {
			value = page.url.searchParams.get(setQueryParamConfig.name) ?? '';
		} else {
			value = '';
		}
	});
</script>

<div class={cn('input-group grid-cols-[1fr_auto] divide-x divide-surface-200-800', className)}>
	<input
		class={cn(inputClass)}
		{...props}
		bind:value
		onkeyup={() => setQueryParam({ ...setQueryParamConfig, value })}
	/>

	<button
		class={cn('input-group-cell preset-tonal-surface', buttonClass)}
		onclick={(event) => {
			setQueryParam({ ...setQueryParamConfig, value });
			onclick?.(event);
		}}
	>
		<Search size="20" />
	</button>
</div>
