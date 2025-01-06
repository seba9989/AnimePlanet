<script lang="ts">
	import Header from '$components/organisms/Header/Header.svelte';
	import '../app.css';
	import { userData } from '$lib/states/user.svelte';

	let { data, children } = $props();
	$effect(() => {
		userData.set(data.user);
	});
</script>

<div class="flex h-screen w-screen flex-col">
	<Header />
	<div class="flex h-full flex-col gap-4 px-4 py-2">
		{@render children()}
	</div>
</div>
