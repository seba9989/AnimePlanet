import { createRole, removeRole } from '$lib/server/db/utils';
import { validForm } from '$lib/server/utils/formValidator';
import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { type } from 'arktype';


export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

const addRolesType = type({
	roles: 'string[]'
});

const removeRoleType = type({
	name: "string"
})

export const actions = {
	addRoles: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, addRolesType, { debug: true });

		if (errors) return error(400, errors);

		await createRole(data);
	},
	removeRole: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, removeRoleType, { debug: true });

		if (errors) return error(400, errors);

		await removeRole(data);
	}
} satisfies Actions;