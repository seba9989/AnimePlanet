<script lang="ts">
	import Form from '$components/molecules/Form';
	import type { PageData } from './$types';
	import { Modal, TagsInput } from '@skeletonlabs/skeleton-svelte';

	let { data }: { data: PageData } = $props();
	let { roles } = $derived(data);

	let addRoleOS = $state({
		value: false,
		close: () => {
			addRoleOS.value = !addRoleOS.value;
		}
	});

	let rolesToAdd = $state<string[]>([]);
</script>

<div class="table-wrap">
	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>Name</th>
				<th class="!text-right">
					<Modal
						bind:open={addRoleOS.value}
						triggerBase="btn preset-tonal"
						contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl w-md  w-[90%] max-w-screen-md"
						backdropClasses="backdrop-blur-sm"
					>
						{#snippet trigger()}Add Role{/snippet}
						{#snippet content()}
							<h2 class="h2">Add Role</h2>
							<Form
								action="?/addRoles"
								class="gap-4 grid"
								onSuccess={addRoleOS.close}
								types={{
									roles: '[array]'
								}}
								staticValues={{ roles: rolesToAdd }}
							>
								<TagsInput
									value={rolesToAdd}
									onValueChange={(e) => (rolesToAdd = e.value)}
									placeholder="Add Role..."
								/>

								<div class="flex ml-auto gap-4">
									<button onclick={addRoleOS.close} type="button" class="btn preset-tonal">
										Close
									</button>
									<Form.Confirm>Confirm</Form.Confirm>
								</div>
							</Form>
						{/snippet}
					</Modal>
				</th>
			</tr>
		</thead>
		<tbody class="hover:[&>tr]:backdrop-brightness-75">
			{#each roles as role}
				<tr>
					<th>{role}</th>
					<th class="!text-right">
						<Form
							action="?/removeRole"
							staticValues={{
								name: role
							}}
						>
							<Form.Confirm class="preset-tonal-error">Remove</Form.Confirm>
						</Form>
					</th>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td>Total</td>
				<td class="text-right">{roles.length} Anime</td>
			</tr>
		</tfoot>
	</table>
</div>
