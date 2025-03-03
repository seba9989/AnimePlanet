import { db } from '$lib/server/db';
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
	type: 'string'
});

export const actions = {
	// TODO: Zarządzanie grupami
	addGroup: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, addGroupType, { debug: true });

		if (errors) return error(400, errors);
	}
} satisfies Actions;
