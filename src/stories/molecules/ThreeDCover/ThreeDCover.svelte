<script lang="ts">
	import Cover, { type Props } from '$components/atoms/Cover/Cover.svelte';
	import ThreeDCard from '$components/atoms/ThreeDCard/ThreeDCard.svelte';
	import { cn } from '$lib/utils/cn';

	let props: Props = $props();
</script>

<ThreeDCard>
	<div class="cover3d">
		<Cover {...props} />
	</div>
</ThreeDCard>

<style lang="postcss">
	.cover3d {
		transition: all 0.5s;
		transform: translateZ(0px);
	}
	.cover3d:hover {
		transform: translateZ(25px);
	}
</style>
