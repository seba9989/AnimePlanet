<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="m-auto text-center">
	<h1 class="h1">{page.status}</h1>
	<h2 class="text-3xl">{page.error?.message}</h2>
</div>
