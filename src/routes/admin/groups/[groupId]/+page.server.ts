import { db } from '$lib/server/db';
import type { CreateUserToGroup } from '$lib/server/db/schema';
import { createUserToGroup, updateUserToGroup } from '$lib/server/db/utils';
import { validForm } from '$lib/server/utils/formValidator';
import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { type } from 'arktype';

export const load = (async (event) => {
	const groupId = event.params.groupId;

	const group = await db.query.group.findFirst({
		where: (group, { eq }) => eq(group.id, groupId),
		with: {
			episodeSource: {
				columns: {},
				with: {
					episodeSource: {
						with: {
							episode: true
						}
					}
				}
			},
			users: {
				columns: {
					role: true
				},
				with: {
					user: true
				}
			}
		}
	});

	const users = await db.query.user.findMany({
		columns: {
			id: true,
			login: true
		}
	});

	if (!group) return error(404, { message: 'Nie Znaleziono Grupy' });

	return { group, users };
}) satisfies PageServerLoad;

const addUserType = type({
	userId: 'string',
	roles: 'string[]'
});

const editUserRoles = type({
	userId: 'string',
	'roles?': 'string[]'
});

export const actions = {
	addUser: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, addUserType, { debug: true });
		const groupId = event.params.groupId;

		if (errors) return error(400, errors);

		const userToGroupPrototype = data.roles.map(
			(v) =>
				({
					groupId,
					role: v,
					userId: data.userId
				}) satisfies CreateUserToGroup
		);
		await createUserToGroup(userToGroupPrototype);
	},
	editUserRoles: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = validForm(formData, editUserRoles, { debug: true });
		const groupId = event.params.groupId;

		if (errors) return error(400, errors);

		await updateUserToGroup({
			groupId,
			userId: data.userId,
			roles: data.roles ?? []
		});
	}
} satisfies Actions;
