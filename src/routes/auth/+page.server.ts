import { hash, verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { passwordsEqual, validateEmail, validateLogin, validatePassword } from '$lib/utils/form';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const login = formData.get('login');
		const password = formData.get('password');

		if (!validateLogin(login)) {
			return fail(400, {
				message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
		}

		const user = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.login, login)
		});

		if (!user) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const validPassword = await verify(user.passwordHash, password, auth.hashSetting);
		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const login = formData.get('login');
		const password = passwordsEqual(formData.getAll('password'));

		if (!validateEmail(email)) {
			return fail(400, { message: 'Invalid emial' });
		}
		if (!validateLogin(login)) {
			return fail(400, { message: 'Invalid login' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		const passwordHash = await hash(password, auth.hashSetting);

		try {
			await db.insert(table.user).values({ email, login, passwordHash });
			const user = await db.query.user.findFirst({
				where: (user, { eq }) => eq(user.login, login)
			});

			if (!user) throw {};

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, user.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch {
			return fail(500, { message: 'An error has occurred' });
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
