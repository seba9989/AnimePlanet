import { hash, verify } from '@node-rs/argon2';
import { error, fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import vine from '@vinejs/vine';
import { validForm } from '$lib/server/utils/formValidator';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

const loginSchema = vine.object({
	login: vine.string().minLength(1).maxLength(255),
	password: vine.string().minLength(8).maxLength(255)
});

const registerSchema = vine.object({
	email: vine.string().email(),
	login: vine.string().minLength(1).maxLength(255),
	password: vine
		.string()
		.minLength(8)
		.maxLength(255)
		.parse((values) => {
			if (vine.helpers.isArray(values) && values.every((v) => v === values[0])) return values[0];
			return;
		})
});

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = await validForm(formData, loginSchema);

		if (errors) return error(400, { message: errors.join('. ') + '.' });

		const user = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.login, data.login)
		});

		if (!user) {
			return error(400, { message: 'Incorrect username or password' });
		}

		const validPassword = await verify(user.passwordHash, data.password, auth.hashSetting);
		if (!validPassword) {
			return error(400, { message: 'Incorrect username or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = await validForm(formData, registerSchema);

		if (errors) return error(400, { message: errors.join('. ') + '.' });

		console.log(data);

		const passwordHash = await hash(data.password, auth.hashSetting);

		try {
			const [user] = await db
				.insert(table.user)
				.values({ ...data, passwordHash })
				.returning();
			if (!user) throw {};

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, user.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch {
			return error(500, { message: 'An error has occurred' });
		}
		return redirect(302, '/');
	},
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/');
	}
};
