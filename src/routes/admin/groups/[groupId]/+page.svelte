<script lang="ts">
	import Input from '$components/atoms/Input';
	import Form from '$components/molecules/Form';
	import type { PageData } from './$types';
	import { Modal } from '@skeletonlabs/skeleton-svelte';

	let { data }: { data: PageData } = $props();
	let { group, groupTypes } = $derived(data);

	let users = $derived.by(() => {
		const _users: Record<string, { roles: string[]; userId: string }> = {};

		group.users.forEach(({ role, user: { login, id } }) => {
			if (login in _users) {
				_users[login].roles.push(role);
			} else {
				_users[login] = {
					roles: [role],
					userId: id
				};
			}
		});

		return _users;
	});

	let addUserOS = $state(false);

	let editUserRolesOS = $state({
		value: false,
		close: () => {
			editUserRolesOS.value = !editUserRolesOS.value;
		}
	});
</script>

<div class="w-fit flex flex-col gap-2">
	<div>
		<h1 class="h3">Group Name:</h1>
		<input class="input" type="text" defaultValue={group.name} name="name" />
	</div>
	<div>
		<h2 class="h3">Type:</h2>
		<select class="select" name="type">
			{#each Object.entries(groupTypes) as [value, description]}
				<option {value}>{description}</option>
			{/each}
		</select>
	</div>
</div>

<div class="table-wrap">
	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>User</th>
				<th>Roles in group</th>
				<th class="!text-right">
					<Modal
						bind:open={addUserOS}
						triggerBase="btn preset-tonal"
						contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl w-md  w-[90%] max-w-screen-md"
						backdropClasses="backdrop-blur-sm"
					>
						{#snippet trigger()}Add User{/snippet}
						{#snippet content()}
							<header class="flex justify-between">
								<h2 class="h2">Add User</h2>
							</header>
							<Form
								class="space-y-4"
								types={{
									roles: '[array]'
								}}
								action="?/addUser"
							>
								<!-- TODO: Selector filter -->
								<label class="label">
									<span class="label-text">Select</span>
									<select name="userId" class="select">
										{#each data.users as user}
											<option value={user.id}>{user.login}</option>
										{/each}
									</select>
								</label>
								<label class="label">
									<span class="label-text">Role</span>
									<Input.Tag name="roles" allTags={data.roles} />
								</label>

								<div class="flex justify-end">
									<Form.Confirm>Add User</Form.Confirm>
								</div>
							</Form>
						{/snippet}
					</Modal>
				</th>
			</tr>
		</thead>
		<tbody class="hover:[&>tr]:backdrop-brightness-75">
			{#each Object.entries(users) as [login, value]}
				<tr>
					<th>{login}</th>
					<th>
						{#each value.roles as role}
							<span class="badge preset-filled">{role}</span>
						{/each}
					</th>
					<th class="!text-right">
						<Modal
							bind:open={editUserRolesOS.value}
							triggerBase="btn preset-tonal"
							contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl w-md  w-[90%] max-w-screen-md"
							backdropClasses="backdrop-blur-sm"
						>
							{#snippet trigger()}Edit User Roles{/snippet}
							{#snippet content()}
								<header class="flex justify-between">
									<h2 class="h2">Edit User Roles</h2>
								</header>
								<Form
									class="space-y-4"
									action="?/editUserRoles"
									staticValues={{
										userId: value.userId
									}}
									types={{
										roles: '[array]'
									}}
								>
									<Input.Tag name="roles" tags={value.roles} allTags={data.roles} />
									<div class="!text-right">
										<Form.Confirm>Confirm</Form.Confirm>
									</div>
								</Form>
							{/snippet}
						</Modal>
					</th>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td colspan="2">Total</td>
				<td class="text-right">{users.length} Elements</td>
			</tr>
		</tfoot>
	</table>
</div>
<pre>{JSON.stringify(data.group, null, 2)}</pre>
