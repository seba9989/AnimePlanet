<script lang="ts">
	import '../app.css';
	import Header from '$components/organisms/Header/Header.svelte';
	import { ToastProvider } from '@skeletonlabs/skeleton-svelte';

	let { children } = $props();
</script>

<ToastProvider>
	<div class="flex h-screen w-screen flex-col">
		<Header />
		<div class="grid gap-4 px-4 py-2">
			{@render children()}
		</div>
	</div>
</ToastProvider>
