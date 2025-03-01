<script lang="ts">
	import Search from '$components/atoms/Input/Search/Search.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	$inspect(data.groups);
</script>

<div>
	<Search
		wrapperClass="w-full max-w-2xl"
		placeholder="Szukany tytuł"
		setQueryParam={{
			name: 'title'
		}}
	/>
</div>
