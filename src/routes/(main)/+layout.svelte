<script lang="ts">
	let { children } = $props();
</script>

<div class="grid h-full content-start gap-4 px-4 py-2">
	{@render children()}
</div>
