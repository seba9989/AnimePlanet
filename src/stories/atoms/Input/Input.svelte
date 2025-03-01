<script lang="ts">
	import Password from './Password/Password.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		wrapperClass?: string;
	}

	let props: Props = $props();

	const { type, wrapperClass } = props;
</script>

{#if type == 'password'}
	<Password {...props} />
{:else}
	<input class="input" {...props} />
{/if}
