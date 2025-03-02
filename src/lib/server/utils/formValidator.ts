import { type, type Type } from 'arktype';

const typeKeyReg = /__type__.*/m;

export type DeclaredType = '[array]' | '[string]' | '[number]' | '[boolean]' | '[object]';

type FormDataType = string | number | boolean | object | File | undefined;
const parseString = (string: string): FormDataType => {
	if (string.trim() === '') {
		return undefined;
	} else if (!isNaN(Number(string))) {
		return Number(string);
	} else if (string.toLowerCase() === 'true' || string.toLowerCase() === 'false') {
		return string.toLowerCase() === 'true';
	} else {
		try {
			return JSON.parse(string);
		} catch {
			return string;
		}
	}
};

export const extractForm = (formData: FormData) => {
	const formDataJson: { [key: string]: unknown } = {};

	formData.forEach((value, key) => {
		if (typeKeyReg.test(key)) return;

		const declaredType = formData.get(`__type__${key}`) as DeclaredType;

		let parsedValue: FormDataType = value;

		if (typeof value === 'string') {
			switch (declaredType) {
				case '[array]':
					parsedValue = [parseString(value)];
					break;
				case '[string]':
					parsedValue = value;
					break;
				case '[number]':
					parsedValue = Number(value);
					break;
				case '[boolean]':
					parsedValue = !!value;
					break;
				case '[object]':
					try {
						parsedValue = JSON.parse(value);
					} catch {
						return;
					}
					break;

				default:
					parsedValue = parseString(value);
					break;
			}
		}

		const keys = new Set(Object.keys(formDataJson));

		if (keys.has(key)) {
			if (Array.isArray(formDataJson[key])) {
				if (Array.isArray(parsedValue)) {
					formDataJson[key].push(...parsedValue);
				} else {
					formDataJson[key].push(parsedValue);
				}
			} else if (formDataJson[key]) {
				formDataJson[key] = [formDataJson[key], parsedValue];
			} else {
				formDataJson[key] = [parsedValue];
			}
		} else {
			formDataJson[key] = parsedValue;
		}
	});

	return formDataJson;
};

type ValidForm<TParser extends Type> =
	| {
			data: TParser['infer'];
			errors?: never;
	  }
	| {
			data?: never;
			errors: {
				message: string;
			};
	  };

export const validForm = <TParser extends Type>(
	formData: FormData | object,
	parser: TParser,
	options = {
		debug: false
	}
): ValidForm<TParser> => {
	const formDataJson = formData instanceof FormData ? extractForm(formData) : formData;

	if (options.debug) console.log(formDataJson);

	const out = parser(formDataJson);

	if (out instanceof type.errors) {
		return { errors: { message: out.summary } };
	} else {
		return { data: out };
	}
};
