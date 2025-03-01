import { init } from '@paralleldrive/cuid2';
import { text } from 'drizzle-orm/sqlite-core';

const createId = init({
	length: 255
});

export const id = (name?: string) => text(name);

export const uuid = (name?: string) =>
	id(name)
		.$defaultFn(() => createId())
		.unique();
