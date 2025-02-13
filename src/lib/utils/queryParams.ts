import { goto } from '$app/navigation';
import { page } from '$app/state';

export type SetQueryParamConfig = { name: string; value: string; pathname?: string };

export const setQueryParam = ({
	name,
	value,
	pathname = page.url.pathname
}: SetQueryParamConfig) => {
	page.url.searchParams.set(name, value);
	goto(`${pathname}?${page.url.searchParams.toString()}`, { keepFocus: true });
	return;
};
