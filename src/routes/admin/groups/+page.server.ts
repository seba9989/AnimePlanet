import { db } from '$lib/server/db';
import { group } from '$lib/server/db/schema';
import { createGroup } from '$lib/server/db/utils';
import { validForm } from '$lib/server/utils/formValidator';
import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { type } from 'arktype';


export const load = (async () => {
	const groups = await db.query.group.findMany();

	return { groups };
}) satisfies PageServerLoad;

const addGroupType = type({
	name: 'string',
	type: ['===', ...group.type.enumValues]
});

export const actions = {
	addGroup: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, addGroupType, { debug: true });

		if (errors) return error(400, errors);

		await createGroup(data);
	},
} satisfies Actions;