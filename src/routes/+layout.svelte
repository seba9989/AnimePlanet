<script lang="ts">
	import Header from '$components/organisms/Header/Header.svelte';
	import '../app.css';
	import { ToastProvider } from '@skeletonlabs/skeleton-svelte';

	let { children } = $props();
</script>

<ToastProvider>
	<div class="flex h-screen w-screen flex-col">
		<Header />
		{@render children()}
	</div>
</ToastProvider>
