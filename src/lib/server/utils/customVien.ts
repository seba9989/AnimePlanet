import vine from '@vinejs/vine';
import type { SchemaTypes } from '@vinejs/vine/types';

export const jsonString = <TSchema extends Record<string, SchemaTypes>>(schema: TSchema) =>
	vine.object(schema).parse((value) => {
		if (typeof value == 'string') return JSON.parse(value);
		if (typeof value == 'object') return value;
		return {};
	});
