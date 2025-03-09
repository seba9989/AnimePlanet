<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let { class: className, ...props }: HTMLInputAttributes = $props();
</script>

<input class={cn(['input', className])} {...props} />
