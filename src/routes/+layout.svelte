<script lang="ts">
	import Header from '$components/organisms/Header/Header.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<Header />
<div class="flex flex-col gap-4 px-4 py-2">
	{@render children()}
</div>
