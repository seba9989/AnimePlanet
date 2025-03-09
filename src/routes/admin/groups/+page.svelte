<script lang="ts">
	import Search from '$components/atoms/Input/Assets/Search.svelte';
	import Form from '$components/molecules/Form';
	import type { PageData } from './$types';
	import { Modal, TagsInput } from '@skeletonlabs/skeleton-svelte';
	import { ArrowUpRight } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
	let { groups, groupTypes } = $derived(data);

	let addGroupOS = $state({
		value: false,
		close: () => {
			addGroupOS.value = !addGroupOS.value;
		}
	});

	let addRoleOS = $state({
		value: false,
		close: () => {
			addRoleOS.value = !addRoleOS.value;
		}
	});
	let rolesToAdd = $state(data.roles);
</script>

<div class="flex justify-between">
	<Search
		class="w-full max-w-2xl"
		placeholder="Szukany tytuł"
		setQueryParam={{
			name: 'title'
		}}
	/>
	<div class="space-x-4">
		<a class="btn preset-tonal" href="groups/roles">Roles</a>
		<Modal
			bind:open={addGroupOS.value}
			triggerBase="btn preset-tonal"
			contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl w-md  w-[90%] max-w-screen-md"
			backdropClasses="backdrop-blur-sm"
		>
			{#snippet trigger()}Add Group{/snippet}
			{#snippet content()}
				<h2 class="h2">Add Group</h2>
				<Form action="?/addGroup" class="gap-4 grid" onSuccess={addGroupOS.close}>
					<input type="text" name="name" placeholder="Nazwa grupy" class="input" />
					<select class="select" name="type" value="SUBTITLES">
						{#each Object.entries(groupTypes) as [value, description]}
							<option {value}>{description}</option>
						{/each}
					</select>
					<div class="flex ml-auto gap-4">
						<button onclick={addGroupOS.close} type="button" class="btn preset-tonal">Close</button>
						<Form.Confirm>Confirm</Form.Confirm>
					</div>
				</Form>
			{/snippet}
		</Modal>
	</div>
</div>

{#if groups.length > 0}
	<div class="table-wrap">
		<table class="table caption-bottom">
			<thead>
				<tr>
					<th>Open</th>
					<th>Name</th>
					<th class="!text-right">Actions</th>
				</tr>
			</thead>
			<tbody class="hover:[&>tr]:backdrop-brightness-75">
				{#each groups as group}
					<tr>
						<th>
							<a href="groups/{group.id}" class="btn-icon preset-tonal"><ArrowUpRight /></a>
						</th>
						<th>{group.name}</th>
						<th class="flex justify-end">
							<!-- <Form
								action="?/removeAnime"
								staticValues={{
									id: anime.id
								}}
							>
								<Form.Confirm class="preset-tonal-error">Remove</Form.Confirm>
							</Form> -->
						</th>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<td colspan="2">Total</td>
					<td class="text-right">{groups.length} Anime</td>
				</tr>
			</tfoot>
		</table>
	</div>
{:else}
	<h2 class="h1 m-auto">Nie ma jeszcze żadnych anime.</h2>
{/if}
