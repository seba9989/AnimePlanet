import vine, { errors, SimpleErrorReporter } from '@vinejs/vine';
import type { Infer, SchemaTypes } from '@vinejs/vine/types';

export const extractForm = (formData: FormData) => {
	const formDataJson: { [key: string]: string | string[] } = {};

	formData.forEach((value, key) => {
		if (key in formDataJson) {
			if (!Array.isArray(formDataJson[key])) {
				formDataJson[key] = [formDataJson[key]];
			}
			if (Array.isArray(formDataJson[key])) {
				formDataJson[key].push(value.toString());
			}
		} else {
			formDataJson[key] = value.toString();
		}
	});

	return formDataJson;
};

type ValidForm<TSchema extends SchemaTypes> =
	| {
			data?: never;
			errors: string[];
	  }
	| {
			data: Infer<TSchema>;
			errors?: never;
	  };

export const validForm = async <TSchema extends SchemaTypes>(
	formData: FormData | object,
	schema: TSchema
): Promise<ValidForm<TSchema>> => {
	const formDataJson = formData instanceof FormData ? extractForm(formData) : formData;

	const validator = vine.compile(schema);
	try {
		const data = await validator.validate(formDataJson);

		return { data };
	} catch (error) {
		if (error instanceof errors.E_VALIDATION_ERROR) {
			const messages = error.messages as SimpleErrorReporter['errors'];

			return { errors: messages.map(({ message }) => message) };
		}
		throw error;
	}
};
