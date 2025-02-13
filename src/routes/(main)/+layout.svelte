<script lang="ts">
	let { children } = $props();
</script>

<div class="grid gap-4 px-4 py-2 h-full">
	{@render children()}
</div>
