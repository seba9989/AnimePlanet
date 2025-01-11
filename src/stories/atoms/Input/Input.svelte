<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Password from './Password/Password.svelte';
	import Search from './Search/Search.svelte';

	interface Props extends HTMLInputAttributes {
		wrapperClass?: string;
	}

	let props: Props = $props();

	const { type, wrapperClass } = props;
</script>

{#if type == 'password'}
	<Password {...props} />
{:else if type == 'search'}
	<Search {...props} />
{:else}
	<input class="input" {...props} />
{/if}
