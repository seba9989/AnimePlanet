<script lang="ts">
	let { children } = $props();
</script>

<div class="grid content-start p-2 gap-4">
	{@render children()}
</div>
