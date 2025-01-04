<script lang="ts">
	import { Eye, EyeClosed, Search } from 'lucide-svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	let props: SvelteHTMLElements['input'] = $props();

	let type = $state(props.type);
	const realType = props.type;

	const showPassword = () => {
		if (type == 'password') {
			type = 'text';
		} else {
			type = 'password';
		}
	};
</script>

{#if realType == 'password'}
	<div class="input-group grid-cols-[1fr_auto] divide-x divide-surface-200-800">
		<input {...props} {type} />
		<button class="input-group-cell preset-tonal-surface" onclick={showPassword}>
			{#if type == 'password'}
				<EyeClosed size="20" />
			{:else}
				<Eye size="20" />
			{/if}
		</button>
	</div>
{:else if realType == 'search'}
	{@const { onclick, ...inputProps } = props}
	<div class="input-group grid-cols-[1fr_auto] divide-x divide-surface-200-800">
		<input {...inputProps} {type} />

		<button
			class="input-group-cell preset-tonal-surface"
		>
			<Search size="20" />
		</button>
	</div>
{:else}
	<input class="input" {...props} />
{/if}
