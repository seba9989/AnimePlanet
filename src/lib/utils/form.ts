import * as v from 'valibot';

// const RegisterSchema = v.object({
//     email: v.pipe(v.string(), v.email()),
//     login: v.string(),
//     password: v.pipe(v.string(), v.minLength(8))
// });

const EmailSchema = v.pipe(v.string(), v.email(), v.maxLength(255));
const LoginSchema = v.pipe(v.string(), v.minLength(3), v.maxLength(255));
const PasswordSchema = v.pipe(v.string(), v.minLength(8), v.maxLength(255));

export const validateEmail = (email: unknown) => v.is(EmailSchema, email);

export const validateLogin = (username: unknown) => v.is(LoginSchema, username);

export const validatePassword = (password: unknown) => v.is(PasswordSchema, password);

export function passwordsEqual(passwords: FormDataEntryValue[]) {
	if (passwords.every((v) => v === passwords[0])) {
		return passwords[0];
	} else {
		return;
	}
}
