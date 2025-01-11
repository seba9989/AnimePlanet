<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex gap-4">
	<label class="label">
		<span class="label-text">Embeds</span>
		<textarea class="textarea" rows="20"></textarea>
	</label>
	<label class="label">
		<span class="label-text">Downloads</span>
		<textarea class="textarea" rows="20"></textarea>
	</label>
</div>
<!-- <div>Test {JSON.stringify(page.params)}</div> -->
