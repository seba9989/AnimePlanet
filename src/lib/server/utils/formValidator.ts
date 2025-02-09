import { type, type Type } from 'arktype';

const typeReg = /\[(.*)\]/m;

export const extractForm = (formData: FormData) => {
	const formDataJson: { [key: string]: unknown } = {};

	formData.forEach((value, key) => {
		let parsedValue: string | number | boolean | object | File = value;

		if (typeof value === 'string') {
			if (typeReg.test(value)) {
				const fixedType = value.match(typeReg) as RegExpMatchArray;

				switch (fixedType[1]) {
					case 'array':
						parsedValue = [];
						break;
				}
			} else if (!(value.trim() === '')) {
				if (!isNaN(Number(value))) {
					parsedValue = Number(value);
				} else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
					parsedValue = value.toLowerCase() === 'true';
				} else {
					try {
						parsedValue = JSON.parse(value);
					} catch {
						parsedValue = value;
					}
				}
			}
		}

		if (formDataJson[key]) {
			if (Array.isArray(formDataJson[key])) {
				formDataJson[key].push(parsedValue);
			} else {
				formDataJson[key] = [formDataJson[key], parsedValue];
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
	options?: {
		debug: boolean;
	}
): ValidForm<TParser> => {
	const formDataJson = formData instanceof FormData ? extractForm(formData) : formData;

	if (options?.debug) console.log(formDataJson);

	const out = parser(formDataJson);

	if (out instanceof type.errors) {
		return { errors: { message: out.summary } };
	} else {
		return { data: out };
	}
};
