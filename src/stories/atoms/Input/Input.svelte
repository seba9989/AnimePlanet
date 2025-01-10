<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Eye, EyeClosed, Search } from 'lucide-svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		wrapperClass?: string;
	}

	let props: Props = $props();

	let type = $state(props.type);
	const { type: realType, wrapperClass } = props;

	const showPassword = () => {
		if (type == 'password') {
			type = 'text';
		} else {
			type = 'password';
		}
	};
</script>

{#if realType == 'password'}
	<div class={cn('input-group grid-cols-[1fr_auto] divide-x divide-surface-200-800', wrapperClass)}>
		<input {...props} {type} />
		<button type="button" class="input-group-cell preset-tonal-surface" onclick={showPassword}>
			{#if type == 'password'}
				<EyeClosed size="20" />
			{:else}
				<Eye size="20" />
			{/if}
		</button>
	</div>
{:else if realType == 'search'}
	<div class={cn('input-group grid-cols-[1fr_auto] divide-x divide-surface-200-800', wrapperClass)}>
		<input {...props} disabled placeholder="Już wkrótce..." {type} />

		<button class="input-group-cell preset-tonal-surface" disabled>
			<Search size="20" />
		</button>
	</div>
{:else}
	<input class="input" {...props} />
{/if}
