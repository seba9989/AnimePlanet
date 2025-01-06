<script lang="ts">
	import Cover, { type Props } from '$components/atoms/Cover/Cover.svelte';
	import ThreeDCard from '$components/atoms/ThreeDCard/ThreeDCard.svelte';

	let props: Props = $props();
</script>

<ThreeDCard>
	<div class="card card-hover">
		<Cover {...props} />
	</div>
</ThreeDCard>
