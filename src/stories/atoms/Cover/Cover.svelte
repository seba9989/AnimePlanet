<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	export interface Props extends HTMLAnchorAttributes {
		img: string;
		title: string;
	}

	let { class: className, img, title, href }: Props = $props();
</script>

<a
	{href}
	class={cn(
		'cover flex w-52 items-end overflow-hidden  drop-shadow-md preset-filled-surface-100-900 hover:drop-shadow-xl',
		className
	)}
	style="--bg-src: url({img});"
>
	<div class="flex h-1/3 w-full items-end bg-gradient-to-t from-surface-900 p-1">
		<p class="truncate">
			{title}
		</p>
	</div>
</a>

<style lang="postcss">
	.cover {
		aspect-ratio: 1/1.5;
		background-image: var(--bg-src);
		background-size: cover;
	}
	.cover:hover {
		transform: translateZ(25px);
	}
</style>
