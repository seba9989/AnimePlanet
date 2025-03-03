<script lang="ts">
	import Search from '$components/atoms/Input/Search/Search.svelte';
	import Form from '$components/molecules/Form';
	import type { PageData } from './$types';
	import { Modal } from '@skeletonlabs/skeleton-svelte';

	let { data }: { data: PageData } = $props();
	let { groups } = $derived(data);

	let openState = $state(true);
	const close = () => (openState = !openState);

	$inspect(groups);
</script>

<div class="flex justify-between">
	<Search
		wrapperClass="w-full max-w-2xl"
		placeholder="Szukany tytuł"
		setQueryParam={{
			name: 'title'
		}}
	/>
	<Modal
		bind:open={openState}
		triggerBase="btn preset-tonal"
		contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl w-md  w-[90%] max-w-screen-md"
		backdropClasses="backdrop-blur-sm"
	>
		{#snippet trigger()}Add Group{/snippet}
		{#snippet content()}
			<h2 class="h2">Add Group</h2>
			<Form action="?/addGroup" class="gap-4 grid" onSuccess={close}>
				<input type="text" name="name" placeholder="Nazwa grupy" class="input" />
				<select class="select" name="type" value="SUBTITLES">
					{#each Object.entries( { INTERNAL: 'Wewnętrzna', VOICEOVER: 'Lektor', SUBTITLES: 'Napisy' } ) as [value, description]}
						<option {value}>{description}</option>
					{/each}
				</select>
				<div class="flex ml-auto gap-4">
					<button onclick={close} type="button" class="btn preset-tonal">Close</button>
					<Form.Confirm>Confirm</Form.Confirm>
				</div>
			</Form>
		{/snippet}
	</Modal>
</div>
