<script lang="ts">
	import Password from './Password/Password.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes;

	let props: Props = $props();

	const { type } = props;
</script>

{#if type == 'password'}
	<Password {...props} />
{:else}
	<input class="input" {...props} />
{/if}
