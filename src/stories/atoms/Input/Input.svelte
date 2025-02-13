<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Password from './Password/Password.svelte';

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
