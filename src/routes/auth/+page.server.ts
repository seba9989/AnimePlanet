import { hash, verify } from '@node-rs/argon2';
import { error, fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { validForm } from '$lib/server/utils/formValidator';
import { type } from 'arktype';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

const loginType = type({
	login: 'string',
	password: 'string'
});

const registerType = type({
	email: 'string.email < 255',
	login: 'string < 255',
	password: type('string', '[]')
		.pipe.try((s, ctx) => {
			if (s.every((v) => v === s[0])) {
				return s[0];
			} else {
				return ctx.reject('passwords must be the same');
			}
		})
		.to('8 < string <= 255')
});

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const { data, errors } = await validForm(formData, loginType);

		if (errors) return error(400, errors);

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

		const { data, errors } = validForm(formData, registerType);

		if (errors) return error(400, errors);

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
